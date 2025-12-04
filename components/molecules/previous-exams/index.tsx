"use client"
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { PenIcon } from "@/assets/icons";
import { ChevronDown, SearchIcon, Settings2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { MapIcon } from "@/assets/icons/MapIcon";
import { ReadingIcon } from "@/assets/icons/ReadingIcon";
import { ListeningIcon } from "@/assets/icons/ListeningIcon";
import { SpeakingIcon } from "@/assets/icons/SpeakingIcon";
import { examService } from "@/services/exam.service";
import { HistoricalExam } from "@/types/historical-exam";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PrivateRouteEnum } from "@/enum/routes.enum";

type ExamData = HistoricalExam;

type SortField = 'date' | 'score' | null;
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export const PreviousExams = () => {
    const router = useRouter();
    const [exams, setExams] = useState<ExamData[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchDropdownRef = useRef<HTMLDivElement>(null);
    const latestRequestRef = useRef<number>(0);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedSearchTerm, setSelectedSearchTerm] = useState<string>("");
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState<boolean>(false);
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);

    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [page, setPage] = useState<number>(1);
    const [pagination, setPagination] = useState({ count: 0, next: false, previous: false });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [serverPageSize, setServerPageSize] = useState<number | null>(null);
    const [serverPages, setServerPages] = useState<Record<number, ExamData[]>>({});

    const orderingParam = useMemo(() => {
        if (!sortField) return undefined;
        const prefix = sortDirection === 'desc' ? '-' : '';
        return `${prefix}${sortField}`;
    }, [sortField, sortDirection]);

    const getNumericScore = (score: ExamData["score"]) => {
        if (typeof score === "number") {
            return score;
        }
        const parsed = parseFloat(score);
        return Number.isNaN(parsed) ? 0 : parsed;
    };

    const getScoreDisplay = (score: ExamData["score"]) => {
        const parsedScore = typeof score === "number" ? score : Number.parseFloat(score);
        if (Number.isFinite(parsedScore)) {
            return parsedScore.toFixed(1);
        }
        if (typeof score === "string") {
            return score;
        }
        return "--";
    };

    const getSkillIcon = (skill: string | null | undefined) => {
        const normalizedSkill = (skill ?? "").toLowerCase();
        if (normalizedSkill === "reading") {
            return <ReadingIcon className="w-6 text-[#23085A]" />;
        }
        if (normalizedSkill === "writing") {
            return <PenIcon className="w-5 h-5 text-[#23085A]" />;
        }
        if (normalizedSkill === "listening") {
            return <ListeningIcon className="w-6 text-[#23085A]" />;
        }
        if (normalizedSkill === "speaking") {
            return <SpeakingIcon className="w-6 h-6 text-[#23085A]" />;
        }
        return null;
    };

    useEffect(() => {
        setPage(1);
        setExams([]);
        setPagination({ count: 0, next: false, previous: false });
        setServerPages({});
        setServerPageSize(null);
    }, [selectedSearchTerm, selectedSkill, orderingParam]);

    const fetchHistoricalExams = useCallback(async () => {
        const requestId = Date.now();
        latestRequestRef.current = requestId;
        setIsLoading(true);
        setError(null);
        try {
            // Ensure we know backend page size by fetching page 1 if unknown or cache empty
            let localServerPages = serverPages;
            let localServerPageSize = serverPageSize;

            const buildParams = (p: number) => ({
                search: selectedSearchTerm.trim() || undefined,
                ordering: orderingParam,
                page: p,
                skill: selectedSkill || undefined,
            });

            // If we don't yet know backend page size, fetch the first server page
            if (!localServerPageSize) {
                if (!localServerPages[1]) {
                    const firstResp = await examService.getHistoricalExams(buildParams(1));
                    if (latestRequestRef.current !== requestId) return;
                    const firstResults = firstResp.results ?? [];
                    localServerPages = { ...localServerPages, 1: firstResults };
                    localServerPageSize = firstResults.length || null;
                    setServerPages(localServerPages);
                    setServerPageSize(localServerPageSize);
                    setPagination({
                        count: firstResp.count ?? 0,
                        next: Boolean(firstResp.next),
                        previous: Boolean(firstResp.previous),
                    });
                } else {
                    localServerPageSize = localServerPages[1]?.length || null;
                    setServerPageSize(localServerPageSize);
                }
            }

            const count = pagination.count;
            // If there is no data
            if ((localServerPageSize ?? 0) === 0 || count === 0) {
                setExams([]);
                return;
            }

            // Compute which backend pages are needed to render the current UI page of size ITEMS_PER_PAGE
            const s = localServerPageSize as number;
            const startIndex = (page - 1) * ITEMS_PER_PAGE; // 0-based global index
            const endExclusive = startIndex + ITEMS_PER_PAGE;
            const serverPageStart = Math.floor(startIndex / s) + 1;
            const serverPageEnd = Math.floor((endExclusive - 1) / s) + 1;

            // Fetch any missing backend pages in the required range
            const pagesToFetch: number[] = [];
            for (let sp = serverPageStart; sp <= serverPageEnd; sp++) {
                if (!localServerPages[sp]) pagesToFetch.push(sp);
            }
            if (pagesToFetch.length > 0) {
                const fetchPromises = pagesToFetch.map((sp) => examService.getHistoricalExams(buildParams(sp)));
                const responses = await Promise.all(fetchPromises);
                if (latestRequestRef.current !== requestId) return;
                const newPages = { ...localServerPages };
                let newCount = count;
                responses.forEach((resp, idx) => {
                    const sp = pagesToFetch[idx];
                    newPages[sp] = resp.results ?? [];
                    if (typeof resp.count === 'number') {
                        newCount = resp.count;
                    }
                });
                localServerPages = newPages;
                setServerPages(newPages);
                if (newCount !== pagination.count) {
                    setPagination({
                        count: newCount,
                        next: page < Math.ceil(newCount / ITEMS_PER_PAGE),
                        previous: page > 1,
                    });
                }
            }

            // Build the 10-item display slice for the UI page
            const startOffset = startIndex - (serverPageStart - 1) * (localServerPageSize as number);
            const concatenated: ExamData[] = [];
            for (let sp = serverPageStart; sp <= serverPageEnd; sp++) {
                const arr = localServerPages[sp] ?? [];
                for (let i = 0; i < arr.length; i++) concatenated.push(arr[i]);
            }
            const displaySlice = concatenated.slice(startOffset, startOffset + ITEMS_PER_PAGE);
            setExams(displaySlice);
        } catch (err: any) {
            if (latestRequestRef.current !== requestId) {
                return;
            }
            const fallbackMessage =
                typeof err === "string"
                    ? err
                    : err?.detail || err?.message || "Failed to load historical exams.";
            setError(fallbackMessage);
        } finally {
            if (latestRequestRef.current === requestId) {
                setIsLoading(false);
            }
        }
    }, [selectedSearchTerm, orderingParam, page, selectedSkill, serverPages, serverPageSize, pagination.count]);

    useEffect(() => {
        fetchHistoricalExams();
    }, [fetchHistoricalExams]);

    const normalize = (v: string | number | null | undefined) => (v ?? "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const capitalize = (text: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);

    // Use exams directly from backend - no frontend filtering needed
    // Backend handles pagination and filtering
    const filteredExams = useMemo(() => {
        return exams;
    }, [exams]);

    // Calculate pagination info based on backend count
    const totalPages = pagination.count > 0 ? Math.ceil(pagination.count / ITEMS_PER_PAGE) : 0;
    const currentPage = page;
    const hasNextPage = totalPages > 0 ? currentPage < totalPages : false;
    const hasPreviousPage = totalPages > 0 ? currentPage > 1 : false;

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsSearchDropdownOpen(value.trim().length > 0);
    };

    const handleSearchSelect = (topic: string) => {
        setSelectedSearchTerm(topic);
        setSearchTerm(topic);
        setIsSearchDropdownOpen(false);
        setPage(1);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setSelectedSearchTerm("");
        setPage(1);
    };

    const handleSkillSelect = (skill: string) => {
        setSelectedSkill(skill);
        setIsSkillDropdownOpen(false);
        setPage(1);
    };

    const handleSkillDropdownToggle = () => {
        setIsSkillDropdownOpen(!isSkillDropdownOpen);
    };

    const clearSkillFilter = () => {
        setSelectedSkill(null);
        setIsSkillDropdownOpen(false);
        setPage(1);
    };

    const handleRetry = () => {
        fetchHistoricalExams();
    };

    const handlePageChange = (newPage: number) => {
        // Only allow valid page changes
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage && !isLoading) {
            setPage(newPage);
        }
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const getMobilePageNumbers = () => {
        // On mobile, show only current page and adjacent pages (max 3 pages)
        const pages: (number | string)[] = [];
        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage === 1) {
                pages.push(1, 2, 3);
            } else if (currentPage === totalPages) {
                pages.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }
        return pages;
    };

    const handleOpenLink = (url?: string | null, fallbackMessage?: string) => {
        if (!url) {
            toast.error(fallbackMessage ?? "Link not available yet.");
            return;
        }
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const handleViewExam = (examId: number | undefined) => {
        if (!examId || isNaN(Number(examId))) {
            toast.error("Invalid exam ID");
            return;
        }
        router.push(`${PrivateRouteEnum.historicalExamDetail}${examId}`);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isSkillDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSkillDropdownOpen(false);
            }
            if (isSearchDropdownOpen && searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
                setIsSearchDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSkillDropdownOpen, isSearchDropdownOpen]);

    // Fetch all unique skills for dropdown (we need to fetch without filters for this)
    const [allExamsForSkills, setAllExamsForSkills] = useState<ExamData[]>([]);
    
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await examService.getHistoricalExams({ page: 1 });
                setAllExamsForSkills(response.results ?? []);
            } catch (err) {
                // Silently fail for skills fetch
            }
        };
        fetchSkills();
    }, []);

    const uniqueSkills = useMemo(() => {
        const skills = allExamsForSkills
            .map(e => e.skill)
            .filter((skill): skill is string => Boolean(skill));
        return Array.from(new Set(skills)).sort();
    }, [allExamsForSkills]);

    const searchResults = useMemo(() => {
        const q = normalize(searchTerm.trim());
        if (!q) return [] as ExamData[];
        // Search in all exams for suggestions
        return allExamsForSkills
            .filter(e => {
                const index = normalize(`${e.date} ${e.topic} ${e.skill} ${e.score}`);
                return index.includes(q);
            })
            .slice(0, 8);
    }, [allExamsForSkills, searchTerm]);

    const noResultsMessage = useMemo(() => {
        if (selectedSkill || selectedSearchTerm.trim()) {
            return "No exams match your current filters.";
        }
        return "No previous exams yet";
    }, [selectedSkill, selectedSearchTerm]);

    const isInitialLoading = isLoading && exams.length === 0;

    const TableRowSkeleton = () => {
        return (
            <tr className="h-8">
                <td className="p-2 px-5  border-b border-t border-[#8E92BC]">
                    <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
                </td>
                <td className="p-2 px-5  border-b border-t border-[#8E92BC]">
                    <div className="h-6 w-6 rounded-full bg-slate-200 animate-pulse" />
                </td>
                <td className="p-2 px-5  border-b border-t border-[#8E92BC]">
                    <div className="h-4 w-12 rounded bg-slate-200 animate-pulse" />
                </td>
                <td className="p-2 px-5  border-b border-t border-[#8E92BC]">
                    <div className="h-4 w-48 rounded bg-slate-200 animate-pulse" />
                </td>
                <td className="p-2 px-5  border-b border-t border-[#8E92BC]">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-24 rounded bg-slate-200 animate-pulse" />
                        <div className="h-9 w-28 rounded bg-slate-200 animate-pulse" />
                    </div>
                </td>
            </tr>
        );
    };

    const MobileCardSkeleton = () => {
        return (
            <div className="rounded-2xl border border-[#F4EFFF] bg-white p-5 shadow-[0px_8px_24px_rgba(35,8,90,0.08)] animate-pulse">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="h-3 w-14 rounded bg-slate-200" />
                        <div className="mt-2 h-5 w-28 rounded bg-slate-200" />
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-[#F4EFFF] px-3 py-1">
                        <div className="h-5 w-5 rounded-full bg-slate-200" />
                        <div className="h-3 w-16 rounded bg-slate-200" />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="h-3 w-12 rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-40 rounded bg-slate-200" />
                </div>
                <div className="mt-4 rounded-2xl border border-[#F4EFFF] bg-[#EFECF5] px-4 py-3">
                    <div className="h-3 w-12 rounded bg-slate-200" />
                    <div className="mt-2 h-7 w-16 rounded bg-slate-200" />
                    <div className="mt-1 h-3 w-20 rounded bg-slate-200" />
                </div>
                <div className="mt-4 flex flex-col gap-2">
                    <div className="h-9 w-full rounded bg-slate-200" />
                    <div className="h-9 w-full rounded bg-slate-200" />
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full bg-[#F0F0F0] mt-15  rounded-[12px] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <h2 className="text-[16px] sm:text-[20px] font-semibold text-[#23085A]">Previous Exams</h2>
        <div className="relative w-full h-full mt-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[12px] border border-[#F4EFFF] overflow-x-auto hidden sm:block" aria-busy={isLoading}>
                {isLoading && (
                    <>
                        <div className="absolute left-0 top-0 h-1 w-full overflow-hidden rounded-t-[12px]">
                            <div className="h-full w-full bg-gradient-to-r from-[#EFECF5] via-[#D7D5E4] to-[#EFECF5] animate-pulse" />
                        </div>
                        <div className="absolute top-4 right-6 flex items-center gap-2 text-xs font-medium text-slate-500">
                            <Loader2 className="w-3 h-3 animate-spin text-[#23085A]" />
                            <span>{isInitialLoading ? "Loading..." : "Refreshing..."}</span>
                        </div>
                    </>
                )}
                <table className="w-full min-w-[720px] text-left table-auto border-separate border-spacing-0 text-xs sm:text-sm">
                    <thead>
                        <tr>
                            <th
                                className="p-2 px-5  transition-colors cursor-pointer border-b border-slate-300 bg-slate-50 hover:bg-slate-100 h-8 text-left"
                                onClick={() => handleSort('date')}
                            >
                                <div className="flex items-center justify-start gap-2 text-[14px] sm:text-[16.25px] font-medium leading-none text-[#23085A] h-full">
                                    Date
                                    <ChevronDown className={`w-4 transition-transform ${sortField === 'date' && sortDirection === 'desc' ? 'rotate-180' : ''
                                        }`} />
                                </div>
                            </th>
                            <th className="p-2 px-5  border-b border-slate-300 bg-slate-50 h-8 relative text-left">
                                <div className="flex items-center justify-start text-[14px] sm:text-[16.25px] font-medium leading-none text-[#23085A] h-full">
                                    <span>{selectedSkill ? capitalize(selectedSkill) : "Skill"}</span>
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={handleSkillDropdownToggle}
                                            className="flex items-center gap-1 hover:bg-slate-100 rounded px-1 py-1 cursor-pointer"
                                            aria-expanded={isSkillDropdownOpen}
                                        >
                                            <Settings2 className="w-5 text-[#23085A]" />
                                        </button>
                                        {isSkillDropdownOpen && (
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-1 bg-[#23085A] p-[2px] rounded-[10px] shadow-lg z-50 min-w-[200px] w-[calc(100vw-2rem)] sm:w-auto sm:max-w-none">
                                                <div className="bg-white rounded-[9px] py-1 h-auto overflow-auto max-h-[60vh] sm:max-h-none">
                                                    <button
                                                        onClick={clearSkillFilter}
                                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#EFECF5] cursor-pointer transition-colors ${selectedSkill === null ? 'bg-[#EFECF5] text-[#23085A] font-semibold' : 'text-slate-700'
                                                            }`}
                                                    >
                                                        All Skills
                                                    </button>
                                                    {uniqueSkills.map((skill) => {
                                                        return (
                                                            <button
                                                                key={skill}
                                                                onClick={() => handleSkillSelect(skill)}
                                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#EFECF5] cursor-pointer transition-colors ${selectedSkill === skill ? 'bg-[#EFECF5] text-[#23085A] font-semibold' : 'text-slate-700'
                                                                    }`}
                                                            >
                                                                <span>{capitalize(skill)}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </th>
                            <th
                                className="p-2 px-5  transition-colors hover:bg-slate-100 cursor-pointer border-b border-slate-300 bg-slate-50 h-8 text-left"
                                onClick={() => handleSort('score')}
                            >
                                <div className="flex items-center justify-start gap-2 text-[14px] sm:text-[16.25px] font-medium leading-none text-[#23085A] h-full">
                                    Score
                                </div>
                            </th>
                            <th className="p-2 px-5  border-b border-slate-300 bg-slate-50 h-8 text-left">
                                <div className="flex items-center justify-start h-full">
                                    <div className="flex p-[8px] bg-[#EFECF5] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[12px] items-center gap-2 relative" ref={searchDropdownRef}>
                                        <SearchIcon className="w-4 text-[#23085A] flex-shrink-0" />
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            onFocus={() => setIsSearchDropdownOpen(searchTerm.trim().length > 0)}
                                            className="bg-transparent border-none outline-none text-[14px] sm:text-[16.25px] text-slate-800 placeholder-slate-500 flex-1 min-w-0"
                                        />
                                        <button
                                            onClick={clearSearch}
                                            className={`text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 w-4 h-4 flex items-center justify-center ${(searchTerm || selectedSearchTerm) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                                            aria-label="Clear search"
                                        >
                                            ✕
                                        </button>

                                        {isSearchDropdownOpen && searchResults.length > 0 && (
                                            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#F4EFFF] rounded-[10px] shadow-lg z-50 h-64 max-h-[60vh] overflow-auto">
                                                {searchResults.map(r => (
                                                    <button
                                                        key={r.id}
                                                        className="w-full text-left px-3 py-2 hover:bg-[#EFECF5] cursor-pointer"
                                                        onClick={() => handleSearchSelect(r.topic)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[#23085A] text-[13px] sm:text-[14px] font-medium">{r.topic}</span>
                                                            <span className="text-slate-500 text-[11px] sm:text-[12px]">{r.date}</span>
                                                        </div>
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            <span key={r.skill} className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded bg-[#F4EFFF] text-[#23085A] border border-[#0000001A]">{r.skill}</span>
                                                            <span className="text-[10px] sm:text-[11px] text-slate-500 ml-auto">Score: {r.score}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </th>
                            <th className="p-2 px-5  border-b border-slate-300 bg-slate-50 h-8 text-left">
                                <div className="flex items-center justify-start text-[14px] sm:text-[16.25px] font-medium leading-none text-[#23085A] h-full">
                                    Actions
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`transition-opacity duration-300 ${isLoading ? 'opacity-40' : 'opacity-100'}`}>
                        {error && exams.length === 0 ? (
                            <tr>
                                <td className="p-6 text-center text-slate-500 border-b border-t border-[#8E92BC]" colSpan={5}>
                                    <div className="flex flex-col items-center gap-3">
                                        <p>{error}</p>
                                        <button
                                            onClick={handleRetry}
                                            className="px-4 py-2 rounded-md bg-[#23085A] text-white text-sm font-semibold hover:bg-[#1a0643] transition-colors"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : isInitialLoading ? (
                            <>
                                {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                                    <TableRowSkeleton key={`skeleton-${idx}`} />
                                ))}
                            </>
                        ) : filteredExams.length === 0 ? (
                            <tr>
                                <td className="p-6 text-center text-slate-500 border-b border-t border-[#8E92BC]" colSpan={5}>
                                    {noResultsMessage}
                                </td>
                            </tr>
                        ) : (
                            filteredExams.map((exam) => {
                                // Skip exams without valid IDs
                                if (!exam.id || isNaN(Number(exam.id))) {
                                    return null;
                                }
                                const scoreDisplay = getScoreDisplay(exam.score);
                                const hasReport = Boolean(exam.full_report_url);
                                const skillIcon = getSkillIcon(exam.skill);
                                return (
                                    <tr key={exam.id} className="h-8 transition-colors hover:bg-slate-50">
                                        <td className="p-2 px-5  border-b border-t border-[#8E92BC] text-start">
                                            <p className="block text-[14px] sm:text-[16.25px] text-slate-800">
                                                {exam.date}
                                            </p>
                                        </td>
                                        <td className="p-2 px-5  border-b border-t border-[#8E92BC] text-start">
                                            <div className="flex items-center justify-start gap-2">
                                                {skillIcon}
                                            </div>
                                        </td>
                                        <td className="p-2 px-5  border-b border-t border-[#8E92BC] text-left">
                                            <div className="flex items-center justify-start gap-2">
                                                <span className="text-[14px] sm:text-[16.25px] text-slate-800">{scoreDisplay ?? "--"}</span>
                                            </div>
                                        </td>
                                        <td className="p-2 px-5  border-b border-t border-[#8E92BC] text-left">
                                            <div className="flex items-center justify-start gap-2 flex-wrap">
                                                <span className="text-[14px] sm:text-[16.25px] text-slate-800">{exam.topic}</span>
                                            </div>
                                        </td>
                                        <td className="p-2 px-5  border-b border-t border-[#8E92BC] text-left">
                                            <div className="flex items-center justify-start gap-2 flex-wrap sm:flex-nowrap">
                                                <div className="flex items-center gap-2  p-[1px] rounded-[9px] w-full sm:w-auto">
                                                    <button
                                                        className="w-full sm:w-auto px-4 sm:px-[57px] py-2 text-[14px] sm:text-[16.25px] bg-[#F4EFFF] border-[1px] border-[#00000033] text-[#23085A] rounded-[8px] transition-colors hover:bg-purple-200 cursor-pointer"
                                                        onClick={() => {
                                                            if (exam.id && !isNaN(Number(exam.id))) {
                                                                handleViewExam(exam.id);
                                                            } else {
                                                                toast.error("Invalid exam ID");
                                                            }
                                                        }}
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                                <button
                                                    className={`w-full sm:w-auto flex items-center justify-start gap-2 px-3 sm:px-[30px] py-2 text-[14px] sm:text-[16.25px] bg-[#F2F2F4] text-[#23085A] font-bold rounded-md transition-colors ${hasReport ? 'hover:bg-gray-200 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                                                    onClick={() => hasReport && handleOpenLink(exam.full_report_url, "Full report not available yet.")}
                                                    disabled={!hasReport}
                                                >
                                                    Full Report
                                                    <MapIcon />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            {!error && (totalPages > 1) && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-6 px-2">
                    <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
                        Showing {filteredExams.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} to {((currentPage - 1) * ITEMS_PER_PAGE) + filteredExams.length} of {pagination.count} exam{pagination.count === 1 ? '' : 's'}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center w-full sm:w-auto">
                        {/* First button - hidden on mobile, visible on md+ */}
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={!hasPreviousPage || isLoading}
                            className="hidden md:flex items-center cursor-pointer gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-[#D7D5E4] text-[#23085A] text-xs sm:text-sm font-medium hover:bg-[#EFECF5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="First page"
                        >
                            First
                        </button>
                        
                        {/* Previous button - chevron only on mobile */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!hasPreviousPage || isLoading}
                            className="flex items-center justify-center cursor-pointer gap-1 px-2.5 sm:px-3 py-2 sm:py-2 rounded-lg border border-[#D7D5E4] text-[#23085A] text-xs sm:text-sm font-medium hover:bg-[#EFECF5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[40px] sm:min-w-auto"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </button>
                        
                        {/* Mobile page numbers - show only 3 pages max */}
                        <div className="flex md:hidden items-center gap-1">
                            {getMobilePageNumbers().map((pageNum) => {
                                const pageNumber = pageNum as number;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        disabled={isLoading}
                                        className={`px-3 py-2 cursor-pointer rounded-lg text-xs font-medium transition-colors min-w-[36px] ${
                                            currentPage === pageNumber
                                                ? 'bg-[#23085A] text-white'
                                                : 'border border-[#D7D5E4] text-[#23085A] hover:bg-[#EFECF5]'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        aria-current={currentPage === pageNumber ? 'page' : undefined}
                                        aria-label={`Page ${pageNumber}`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="hidden md:flex items-center cursor-pointer gap-0.5 sm:gap-1">
                            {getPageNumbers().map((pageNum, idx) => {
                                if (pageNum === '...') {
                                    return (
                                        <span key={`ellipsis-${idx}`} className="px-1 sm:px-2 text-slate-500 text-xs sm:text-sm">
                                            ...
                                        </span>
                                    );
                                }
                                const pageNumber = pageNum as number;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        disabled={isLoading}
                                        className={`px-2 sm:px-3 py-1.5 sm:py-2 cursor-pointer rounded-lg text-xs sm:text-sm font-medium transition-colors min-w-[32px] sm:min-w-[40px] ${
                                            currentPage === pageNumber
                                                ? 'bg-[#23085A] text-white'
                                                : 'border border-[#D7D5E4] text-[#23085A] hover:bg-[#EFECF5]'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        aria-current={currentPage === pageNumber ? 'page' : undefined}
                                        aria-label={`Page ${pageNumber}`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Next button - chevron only on mobile */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!hasNextPage || isLoading}
                            className="flex items-center justify-center cursor-pointer gap-1 px-2.5 sm:px-3 py-2 sm:py-2 rounded-lg border border-[#D7D5E4] text-[#23085A] text-xs sm:text-sm font-medium hover:bg-[#EFECF5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[40px] sm:min-w-auto"
                            aria-label="Next page"
                        >
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4" />
                        </button>
                        
                        {/* Last button - hidden on mobile, visible on md+ */}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={!hasNextPage || isLoading}
                            className="hidden md:flex items-center cursor-pointer gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-[#D7D5E4] text-[#23085A] text-xs sm:text-sm font-medium hover:bg-[#EFECF5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Last page"
                        >
                            Last
                        </button>
                    </div>
                </div>
            )}
        <div className="sm:hidden mt-6 space-y-4">
            {error && exams.length === 0 ? (
                <div className="rounded-2xl border border-[#8E92BC] bg-white p-5 text-center text-slate-600 shadow-sm">
                    <p className="mb-3">{error}</p>
                    <button
                        onClick={handleRetry}
                        className="w-full rounded-xl bg-[#23085A] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#1a0643] transition-colors"
                    >
                        Try again
                    </button>
                </div>
            ) : isInitialLoading ? (
                <div className="rounded-2xl border border-[#8E92BC] bg-white p-5 text-center text-slate-600 shadow-sm">
                    <div className="mx-auto mb-4 h-3 w-24 rounded bg-slate-200 animate-pulse" />
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <div key={`mobile-skeleton-${idx}`} className="mt-4">
                            <MobileCardSkeleton />
                        </div>
                    ))}
                </div>
            ) : filteredExams.length === 0 ? (
                <div className="rounded-2xl border border-[#8E92BC] bg-white p-5 text-center text-slate-600 shadow-sm">
                    {noResultsMessage}
                </div>
            ) : (
                <>
                    <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-40' : 'opacity-100'}`}>
                    {filteredExams.map((exam) => {
                        if (!exam.id || isNaN(Number(exam.id))) {
                            return null;
                        }
                        const scoreDisplay = getScoreDisplay(exam.score);
                        const hasReport = Boolean(exam.full_report_url);
                        const skillIcon = getSkillIcon(exam.skill);
                        return (
                            <div
                                key={exam.id}
                                className="rounded-2xl border border-[#F4EFFF] bg-white p-5 shadow-[0px_8px_24px_rgba(35,8,90,0.08)]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-wide text-slate-500">Date</p>
                                        <p className="text-lg font-semibold text-[#23085A]">{exam.date}</p>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full bg-[#F4EFFF] px-3 py-1 text-[#23085A]">
                                        {skillIcon}
                                        <span className="text-sm font-semibold">{exam.skill ?? "N/A"}</span>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Topic</p>
                                    <p className="mt-1 text-base font-semibold text-slate-800">{exam.topic}</p>
                                </div>
                                <div className="mt-4 rounded-2xl border border-[#F4EFFF] bg-[#EFECF5] px-4 py-3">
                                    <p className="text-[11px] uppercase tracking-wide text-slate-500">Score</p>
                                    <p className="text-3xl font-bold text-[#23085A]">{scoreDisplay ?? "--"}</p>
                                    <p className="text-xs text-slate-500">Band result</p>
                                </div>
                                <div className="mt-4 flex flex-col gap-2">
                                    <button
                                        className="w-full rounded-xl border border-[#00000033] px-4 py-2 text-base font-semibold text-[#23085A] transition-colors bg-[#F4EFFF] hover:bg-[#e0d3ff]"
                                        onClick={() => {
                                            if (exam.id && !isNaN(Number(exam.id))) {
                                                handleViewExam(exam.id);
                                            } else {
                                                toast.error("Invalid exam ID");
                                            }
                                        }}
                                    >
                                        View
                                    </button>
                                    <button
                                        className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-base font-semibold transition-colors ${hasReport ? 'bg-[#23085A] text-white hover:bg-[#1a0643]' : 'bg-[#F2F2F4] text-[#23085A] opacity-50 cursor-not-allowed'}`}
                                        onClick={() => hasReport && handleOpenLink(exam.full_report_url, "Full report not available yet.")}
                                        disabled={!hasReport}
                                    >
                                        Full Report
                                        <MapIcon />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Mobile Pagination */}
                    {!error && (totalPages > 1 || hasNextPage || hasPreviousPage) && (
                        <div className="flex flex-col items-center gap-3 mt-6">
                            <div className="text-xs text-slate-600 text-center">
                                Showing {filteredExams.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE) + 1 : 0} to {((currentPage - 1) * ITEMS_PER_PAGE) + filteredExams.length} of {pagination.count} exam{pagination.count === 1 ? '' : 's'}
                            </div>
                            <div className="flex items-center gap-2 w-full justify-center">
                                {/* Previous button - chevron only */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={!hasPreviousPage || isLoading}
                                    className="flex items-center justify-center cursor-pointer px-3 py-2.5 rounded-lg border border-[#D7D5E4] text-[#23085A] hover:bg-[#EFECF5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px]"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                
                                {/* Page numbers - show only 3 pages max */}
                                <div className="flex items-center gap-1">
                                    {getMobilePageNumbers().map((pageNum) => {
                                        const pageNumber = pageNum as number;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => handlePageChange(pageNumber)}
                                                disabled={isLoading}
                                                className={`px-3 py-2 cursor-pointer rounded-lg text-sm font-medium transition-colors min-w-[40px] ${
                                                    currentPage === pageNumber
                                                        ? 'bg-[#23085A] text-white'
                                                        : 'border border-[#D7D5E4] text-[#23085A] hover:bg-[#EFECF5]'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                aria-current={currentPage === pageNumber ? 'page' : undefined}
                                                aria-label={`Page ${pageNumber}`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {/* Next button - chevron only */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!hasNextPage || isLoading}
                                    className="flex items-center justify-center cursor-pointer px-3 py-2.5 rounded-lg border border-[#D7D5E4] text-[#23085A] hover:bg-[#EFECF5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px]"
                                    aria-label="Next page"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                    </div>
                </>
            )}
        </div>
    </div>
    );
};