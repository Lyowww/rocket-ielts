"use client"
import { useState, useEffect, useRef, useMemo } from "react";
import { PenIcon } from "@/assets/icons";
import { ChevronDown, SearchIcon, Settings2 } from "lucide-react";
import { MapIcon } from "@/assets/icons/MapIcon";
import { ReadingIcon } from "@/assets/icons/ReadingIcon";
import { ListeningIcon } from "@/assets/icons/ListeningIcon";
import { SpeakingIcon } from "@/assets/icons/SpeakingIcon";

interface ExamData {
    id: number;
    date: string;
    skill: string;
    score: number;
    topic: string;
}

type SortField = 'date' | 'score' | null;
type SortDirection = 'asc' | 'desc';

export const PreviousExams = () => {
    const [exams, setExams] = useState<ExamData[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchDropdownRef = useRef<HTMLDivElement>(null);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
    const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState<boolean>(false);
    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState<boolean>(false);

    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const normalize = (v: string) => v.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

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
                let aValue: number | string = sortField === 'date' ? new Date(a.date).getTime() : a.score;
                let bValue: number | string = sortField === 'date' ? new Date(b.date).getTime() : b.score;
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

    const uniqueSkills = useMemo(() => Array.from(new Set(exams.map(e => e.skill))).sort(), [exams]);

    const searchResults = useMemo(() => {
        const q = normalize(searchTerm.trim());
        if (!q) return [] as ExamData[];
        return preparedExams.filter(pe => pe.index.includes(q)).slice(0, 8).map(pe => pe.original);
    }, [preparedExams, searchTerm]);

    return (
        <div className="w-full h-full bg-[#F6F6FB] mt-15  rounded-[12px] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <h2 className="text-[16px] sm:text-[20px] font-semibold text-[#23085A]">Previous Exams</h2>
            <div className="relative w-full h-full mt-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[12px] border border-[#F4EFFF] overflow-x-auto">
                <table className="w-full text-left table-auto border-separate border-spacing-0">
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
                                        {searchTerm !== debouncedSearchTerm && (
                                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                        )}
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
                        {filteredExams.length === 0 ? (
                            <tr>
                                <td className="p-6 text-center text-slate-500 border-b border-t border-[#8E92BC]" colSpan={5}>
                                    No previous exams yet
                                </td>
                            </tr>
                        ) : (
                            filteredExams.map((exam) => {
                                const isSelected = selectedSkill !== null && exam.skill === selectedSkill;
                                return (
                                    <tr key={exam.id} className={`h-8 transition-colors ${isSelected ? 'bg-[#EFECF5] hover:bg-[#E1D4F0]' : 'hover:bg-slate-50'}`}>
                                        <td className="p-2 px-5  border-b border-t border-[#8E92BC] text-start">
                                            <p className="block text-[14px] sm:text-[16.25px] text-slate-800">
                                                {exam.date}
                                            </p>
                                        </td>
                                        <td className="p-2 px-5  border-b border-t border-[#8E92BC] text-start">
                                            <div className="flex items-center justify-start gap-2">
                                                {
                                                    exam.skill === "Reading" && (
                                                        <ReadingIcon className="w-6 text-[#23085A]" />
                                                    )
                                                }
                                                {
                                                    exam.skill === "Writing" && (
                                                        <PenIcon className="w-5 h-5 text-[#23085A]" />
                                                    )
                                                }
                                                {
                                                    exam.skill === "Listening" && (
                                                        <ListeningIcon className="w-6 text-[#23085A]" />
                                                    )
                                                }
                                                {
                                                    exam.skill === "Speaking" && (
                                                        <SpeakingIcon className="w-6 h-6 text-[#23085A]" />
                                                    )
                                                }
                                            </div>
                                        </td>
                                        <td className="p-2 px-5  border-b border-t border-[#8E92BC] text-left">
                                            <div className="flex items-center justify-start gap-2">
                                                <span className="text-[14px] sm:text-[16.25px] text-slate-800">{exam.score}</span>
                                            </div>
                                        </td>
                                        <td className="p-2 px-5  border-b border-t border-[#8E92BC] text-left">
                                            <div className="flex items-center justify-start gap-2 flex-wrap">
                                                <span className="text-[14px] sm:text-[16.25px] text-slate-800">{exam.topic}</span>
                                            </div>
                                        </td>
                                        <td className="p-2 px-5  border-b border-t border-[#8E92BC] text-left">
                                            <div className="flex items-center justify-start gap-2 flex-wrap sm:flex-nowrap">
                                                <div className="flex items-center gap-2  p-[1px] cursor-pointer rounded-[9px] w-full sm:w-auto">
                                                    <button
                                                        className="w-full sm:w-auto px-4 sm:px-[57px] py-2 text-[14px] sm:text-[16.25px] bg-[#F4EFFF] border-[1px] border-[#00000033] text-[#23085A] rounded-[8px] cursor-pointer hover:bg-purple-200 transition-colors"
                                                        onClick={() => console.log('View Q/A/Feedback for exam:', exam.id)}
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                                <button
                                                    className="w-full sm:w-auto flex items-center justify-start gap-2 px-3 sm:px-[30px] py-2 text-[14px] sm:text-[16.25px] bg-[#F2F2F4] text-[#23085A] font-bold cursor-pointer rounded-md hover:bg-gray-200 transition-colors"
                                                    onClick={() => console.log('Get Full Report for exam:', exam.id)}
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
        </div>


    )
}