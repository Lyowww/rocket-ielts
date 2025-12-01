"use client"
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { PenIcon } from "@/assets/icons";
import { ChevronDown, SearchIcon, Settings2 } from "lucide-react";
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

export const PreviousExams = () => {
    const router = useRouter();
    const [exams, setExams] = useState<ExamData[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchDropdownRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const latestRequestRef = useRef<number>(0);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState<boolean>(false);
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);

    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [page, setPage] = useState<number>(1);
    const [pagination, setPagination] = useState({ count: 0, next: false, previous: false });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

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
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        setPage(1);
        setExams([]);
        setPagination({ count: 0, next: false, previous: false });
    }, [debouncedSearchTerm, orderingParam]);

    const fetchHistoricalExams = useCallback(async () => {
        const requestId = Date.now();
        latestRequestRef.current = requestId;
        setIsLoading(true);
        setError(null);
        try {
            const response = await examService.getHistoricalExams({
                search: debouncedSearchTerm.trim() || undefined,
                ordering: orderingParam,
                page,
            });

            if (latestRequestRef.current !== requestId) {
                return;
            }

            setExams((prev) => {
                const incoming = response.results ?? [];
                if (page === 1) {
                    return incoming;
                }
                const existingIds = new Set(prev.map((exam) => exam.id));
                const merged = [...prev];
                incoming.forEach((exam) => {
                    if (!existingIds.has(exam.id)) {
                        merged.push(exam);
                    }
                });
                return merged;
            });
            setPagination({
                count: response.count ?? 0,
                next: Boolean(response.next),
                previous: Boolean(response.previous),
            });
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
    }, [debouncedSearchTerm, orderingParam, page]);

    useEffect(() => {
        fetchHistoricalExams();
    }, [fetchHistoricalExams]);

    const normalize = (v: string | number | null | undefined) => (v ?? "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const preparedExams = useMemo(() => {
        return exams.map(e => ({
            original: e,
            index: normalize(`${e.date} ${e.topic} ${e.skill} ${e.score}`),
        }));
    }, [exams]);

    const normalizedSearch = useMemo(() => normalize(debouncedSearchTerm), [debouncedSearchTerm]);

    const filteredExams = useMemo(() => {
        let result = preparedExams
            .filter(pe => {
                const matchesSearch = normalizedSearch ? pe.index.includes(normalizedSearch) : true;
                const matchesSkill = selectedSkill ? pe.original.skill === selectedSkill : true;
                return matchesSearch && matchesSkill;
            })
            .map(pe => pe.original);

        if (sortField) {
            result = result.slice().sort((a, b) => {
                const aValue = sortField === 'date' ? new Date(a.date).getTime() : getNumericScore(a.score);
                const bValue = sortField === 'date' ? new Date(b.date).getTime() : getNumericScore(b.score);
                if (sortDirection === 'asc') return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            });
        }

        return result;
    }, [preparedExams, normalizedSearch, selectedSkill, sortField, sortDirection]);

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

    const clearSearch = () => {
        setSearchTerm("");
        setDebouncedSearchTerm("");
    };

    const handleSkillSelect = (skill: string) => {
        setSelectedSkill(skill);
        setIsSkillDropdownOpen(false);
    };

    const handleSkillDropdownToggle = () => {
        setIsSkillDropdownOpen(!isSkillDropdownOpen);
    };

    const clearSkillFilter = () => {
        setSelectedSkill(null);
        setIsSkillDropdownOpen(false);
    };

    const handleRetry = () => {
        fetchHistoricalExams();
    };

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && !isLoading && pagination.next && !error) {
                    setPage((prev) => prev + 1);
                }
            },
            { root: null, rootMargin: "200px", threshold: 0 }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [isLoading, pagination.next, error]);

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

    const uniqueSkills = useMemo(() => {
        const skills = exams
            .map(e => e.skill)
            .filter((skill): skill is string => Boolean(skill));
        return Array.from(new Set(skills)).sort();
    }, [exams]);

    const searchResults = useMemo(() => {
        const q = normalize(searchTerm.trim());
        if (!q) return [] as ExamData[];
        return preparedExams.filter(pe => pe.index.includes(q)).slice(0, 8).map(pe => pe.original);
    }, [preparedExams, searchTerm]);

    const noResultsMessage = useMemo(() => {
        if (selectedSkill || debouncedSearchTerm.trim()) {
            return "No exams match your current filters.";
        }
        return "No previous exams yet";
    }, [selectedSkill, debouncedSearchTerm]);

    const isInitialLoading = isLoading && exams.length === 0;
    const isFetchingMore = isLoading && exams.length > 0;

    return (
        <div className="w-full h-full bg-[#F6F6FB] mt-15  rounded-[12px] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <h2 className="text-[16px] sm:text-[20px] font-semibold text-[#23085A]">Previous Exams</h2>
        <div className="relative w-full h-full mt-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[12px] border border-[#F4EFFF] overflow-x-auto hidden sm:block">
                {isLoading && (
                    <div className="absolute top-4 right-6 text-xs font-medium text-slate-500">
                        {isInitialLoading ? "Loading..." : "Refreshing..."}
                    </div>
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
                                    <span>{selectedSkill ? selectedSkill : "Skill"}</span>
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={handleSkillDropdownToggle}
                                            className="flex items-center gap-1 hover:bg-slate-100 rounded px-1 py-1 cursor-pointer"
                                            aria-expanded={isSkillDropdownOpen}
                                        >
                                            <Settings2 className="w-5 text-[#23085A]" />
                                        </button>
                                        {isSkillDropdownOpen && (
                                            <div className="absolute top-full left-0 mt-1 bg-[#23085A] p-[2px] rounded-[10px] shadow-lg z-50 min-w-[200px]">
                                                <div className="bg-white rounded-[9px] py-1 h-auto overflow-auto">
                                                    <button
                                                        onClick={clearSkillFilter}
                                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-[#EFECF5] cursor-pointer transition-colors ${selectedSkill === null ? 'bg-[#EFECF5] text-[#23085A] font-semibold' : 'text-slate-700'
                                                            }`}
                                                    >
                                                        All Skills ({exams.length})
                                                    </button>
                                                    {uniqueSkills.map((skill) => {
                                                        const count = exams.filter(exam => exam.skill === skill).length;
                                                        return (
                                                            <button
                                                                key={skill}
                                                                onClick={() => handleSkillSelect(skill)}
                                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#EFECF5] cursor-pointer flex justify-between items-center transition-colors ${selectedSkill === skill ? 'bg-[#EFECF5] text-[#23085A] font-semibold' : 'text-slate-700'
                                                                    }`}
                                                            >
                                                                <span>{skill}</span>
                                                                <span className={`text-xs px-1.5 py-0.5 rounded ${selectedSkill === skill ? 'bg-[#23085A] text-white' : 'bg-slate-200 text-slate-600'}`}>{count}</span>
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
                                        <SearchIcon className={`w-4 text-[#23085A] ${searchTerm !== debouncedSearchTerm ? 'animate-pulse' : ''}`} />
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            onFocus={() => setIsSearchDropdownOpen(searchTerm.trim().length > 0)}
                                            className="bg-transparent border-none outline-none text-[14px] sm:text-[16.25px] text-slate-800 placeholder-slate-500 w-full"
                                        />
                                        {searchTerm && (
                                            <button
                                                onClick={clearSearch}
                                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        )}

                                        {isSearchDropdownOpen && searchResults.length > 0 && (
                                            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#F4EFFF] rounded-[10px] shadow-lg z-50 h-64 overflow-auto">
                                                {searchResults.map(r => (
                                                    <button
                                                        key={r.id}
                                                        className="w-full text-left px-3 py-2 hover:bg-[#EFECF5] cursor-pointer"
                                                        onClick={() => {
                                                            setSearchTerm(r.topic);
                                                            setDebouncedSearchTerm(r.topic);
                                                            setIsSearchDropdownOpen(false);
                                                            setPage(1);
                                                        }}
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
                        </tr>
                    </thead>
                    <tbody>
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
                            <tr>
                                <td className="p-6 text-center text-slate-500 border-b border-t border-[#8E92BC]" colSpan={5}>
                                    Loading previous exams...
                                </td>
                            </tr>
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
                                const isSelected = selectedSkill !== null && exam.skill === selectedSkill;
                                const scoreDisplay = getScoreDisplay(exam.score);
                                const hasFinalAnswer = Boolean(exam.final_answer);
                                const hasReport = Boolean(exam.full_report_url);
                                const skillIcon = getSkillIcon(exam.skill);
                                return (
                                    <tr key={exam.id} className={`h-8 transition-colors ${isSelected ? 'bg-[#EFECF5] hover:bg-[#E1D4F0]' : 'hover:bg-slate-50'}`}>
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-4 text-sm text-slate-600">
                {/* <p>
                    {pagination.count
                        ? `Loaded ${Math.min(exams.length, pagination.count)} of ${pagination.count} exam${pagination.count === 1 ? '' : 's'}`
                        : exams.length
                            ? `Loaded ${exams.length} exam${exams.length === 1 ? '' : 's'}`
                            : 'No exams found'}
                    {filteredExams.length
                        ? ` · ${filteredExams.length} visible${selectedSkill ? ` for ${selectedSkill}` : ''}`
                        : ''}
                </p>
                <span className="text-xs text-slate-500">
                    {pagination.next
                        ? "More results will load automatically"
                        : exams.length
                            ? "End of results"
                            : ""}
                </span> */}
            </div>
            {/* <div
                ref={loadMoreRef}
                className="mt-2 h-12 flex items-center justify-center text-xs text-slate-500"
            >
                {error && exams.length > 0 ? (
                    <button
                        onClick={handleRetry}
                        className="px-3 py-1.5 rounded-md border border-[#D7D5E4] text-[#23085A] text-xs font-medium hover:bg-[#EFECF5] transition-colors"
                    >
                        Couldn’t load more. Tap to retry.
                    </button>
                ) : isFetchingMore ? (
                    "Loading more exams..."
                ) : pagination.next ? (
                    "Scroll to load more"
                ) : exams.length ? (
                    "You're all caught up."
                ) : (
                    ""
                )}
            </div> */}
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
                    Loading previous exams...
                </div>
            ) : filteredExams.length === 0 ? (
                <div className="rounded-2xl border border-[#8E92BC] bg-white p-5 text-center text-slate-600 shadow-sm">
                    {noResultsMessage}
                </div>
            ) : (
                filteredExams.map((exam) => {
                    // Skip exams without valid IDs
                    if (!exam.id || isNaN(Number(exam.id))) {
                        return null;
                    }
                    const scoreDisplay = getScoreDisplay(exam.score);
                    const hasFinalAnswer = Boolean(exam.final_answer);
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
                })
            )}
        </div>
    </div>
    );
};