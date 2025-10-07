"use client"
import { useState, useEffect, useRef } from "react";
import { DownloadIcon, PenIcon } from "@/assets/icons";
import { ArrowDown, ChevronDown, SearchIcon, Settings, Settings2 } from "lucide-react";
import { TestType } from "@/enum/test-types.enum";

interface ExamData {
    id: number;
    date: string;
    type: TestType;
    score: number;
    topic: string;
}

type SortField = 'date' | 'score' | null;
type SortDirection = 'asc' | 'desc';

export const PreviousExams = () => {
    const [exams, setExams] = useState<ExamData[]>([]);
    const [filteredExams, setFilteredExams] = useState<ExamData[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [selectedType, setSelectedType] = useState<TestType | null>(null);
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState<boolean>(false);

    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    useEffect(() => {
        const initialExams: ExamData[] = [
            { id: 1, date: "Sept 27, 2025", type: TestType.WRITING, score: 8.0, topic: "Environmental Issues" },
            { id: 2, date: "Sept 25, 2025", type: TestType.READING, score: 7.5, topic: "Technology and Society" },
            { id: 3, date: "Sept 30, 2025", type: TestType.LISTENING, score: 6.5, topic: "Education System" },
            { id: 4, date: "Sept 20, 2025", type: TestType.SPEAKING, score: 8.5, topic: "Cultural Diversity" },
            { id: 5, date: "Sept 15, 2025", type: TestType.GENERAL, score: 7.0, topic: "Work-Life Balance" },
            { id: 6, date: "Oct 2, 2025", type: TestType.ACADEMIC, score: 9.0, topic: "Scientific Research" },
            { id: 7, date: "Sept 18, 2025", type: TestType.WRITING, score: 6.0, topic: "Urban Development" },
            { id: 8, date: "Sept 22, 2025", type: TestType.READING, score: 8.5, topic: "Health and Wellness" },
            { id: 9, date: "Sept 28, 2025", type: TestType.LISTENING, score: 7.0, topic: "Global Economy" },
            { id: 10, date: "Oct 1, 2025", type: TestType.SPEAKING, score: 7.5, topic: "Social Media Impact" },
        ];
        setExams(initialExams);
        setFilteredExams(initialExams);
    }, []);

    // Debounce search term for smoother performance
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        let filtered = exams.filter(exam => {
            const matchesSearch = exam.date.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                exam.type.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                exam.topic.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                exam.score.toString().includes(debouncedSearchTerm);
            
            return matchesSearch;
        });

        // Sort the filtered results
        if (sortField) {
            filtered = filtered.sort((a, b) => {
                let aValue = a[sortField];
                let bValue = b[sortField];

                if (sortField === 'date') {
                    aValue = new Date(aValue as string).getTime();
                    bValue = new Date(bValue as string).getTime();
                }

                if (sortDirection === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
        }

        setFilteredExams(filtered);
    }, [exams, debouncedSearchTerm, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setDebouncedSearchTerm("");
    };

    const handleTypeSelect = (type: TestType) => {
        setSelectedType(type);
        setIsTypeDropdownOpen(false);
    };

    const handleTypeDropdownToggle = () => {
        setIsTypeDropdownOpen(!isTypeDropdownOpen);
    };

    const clearTypeFilter = () => {
        setSelectedType(null);
        setIsTypeDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isTypeDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsTypeDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isTypeDropdownOpen]);

    return (
        <>
            <h2 className="text-[20px] font-bold mt-15 text-[#090909] italic">Previous Exams</h2>

            <div className="relative w-full h-full p-[1px] mt-[30px] bg-gradient-to-r from-[#23085A] to-[#651FFF] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[12px]">
                <div className="w-full h-full bg-white rounded-[12px] overflow-auto">
                    <table className="w-full text-left table-auto min-w-max">
                        <thead>
                            <tr>
                                <th
                                    className="p-2 transition-colors cursor-pointer border-b border-slate-300 bg-slate-50 hover:bg-slate-100 h-8"
                                    onClick={() => handleSort('date')}
                                >
                                    <div className="flex items-center justify-center gap-2 text-[16.25px] font-medium leading-none text-[#23085A] h-full">
                                        Sort By Date
                                        <ChevronDown className={`w-4 transition-transform ${sortField === 'date' && sortDirection === 'desc' ? 'rotate-180' : ''
                                            }`} />
                                    </div>
                                </th>
                                <th className="p-2 border-b border-slate-300 bg-slate-50 h-8 relative">
                                    <div className="flex items-center justify-center gap-2 text-[16.25px] font-medium leading-none text-[#23085A] h-full">
                                        <span>{selectedType ? selectedType : "Type of the test"}</span>
                                        <div className="relative" ref={dropdownRef}>
                                            <button
                                                onClick={handleTypeDropdownToggle}
                                                className="flex items-center gap-1 hover:bg-slate-100 rounded px-1 py-1 cursor-pointer"
                                            >
                                                <Settings2 className="w-5 text-[#23085A]" />
                                            </button>
                                            {isTypeDropdownOpen && (
                                                <div className="absolute top-full left-0 mt-1 bg-gradient-to-r from-[#23085A] to-[#651FFF] p-[2px] rounded-[10px] shadow-lg z-10 min-w-[160px]">
                                                    <div className="bg-white rounded-[9px] py-1">
                                                        <button
                                                            onClick={clearTypeFilter}
                                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-[#EFECF5] cursor-pointer transition-colors ${
                                                                selectedType === null ? 'bg-[#EFECF5] text-[#23085A] font-semibold' : 'text-slate-700'
                                                            }`}
                                                        >
                                                            All Types ({exams.length})
                                                        </button>
                                                        {Object.values(TestType).map((type) => {
                                                            const count = exams.filter(exam => exam.type === type).length;
                                                            return (
                                                                <button
                                                                    key={type}
                                                                    onClick={() => handleTypeSelect(type)}
                                                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-[#EFECF5] cursor-pointer flex justify-between items-center transition-colors ${
                                                                        selectedType === type ? 'bg-[#EFECF5] text-[#23085A] font-semibold' : 'text-slate-700'
                                                                    }`}
                                                                >
                                                                    <span>{type}</span>
                                                                    <span className={`text-xs px-1.5 py-0.5 rounded ${selectedType === type ? 'bg-[#23085A] text-white' : 'bg-slate-200 text-slate-600'}`}>{count}</span>
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
                                    className="p-2 transition-colors hover:bg-slate-100 cursor-pointer border-b border-slate-300 bg-slate-50 h-8"
                                    onClick={() => handleSort('score')}
                                >
                                    <div className="flex items-center justify-center gap-2 text-[16.25px] font-medium leading-none text-[#23085A] h-full">
                                        Sort By Score
                                    </div>
                                </th>
                                <th className="p-2 border-b border-slate-300 bg-slate-50 h-8">
                                    <div className="flex items-center justify-center h-full">
                                        <div className="flex p-[8px] bg-[#EFECF5] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[12px] items-center gap-2">
                                            <SearchIcon className={`w-4 text-[#23085A] ${searchTerm !== debouncedSearchTerm ? 'animate-pulse' : ''}`} />
                                            <input
                                                type="text"
                                                placeholder="Search"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                className="bg-transparent border-none outline-none text-[16.25px] text-slate-800 placeholder-slate-500 w-full"
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
                                        </div>
                                    </div>
                                </th>
                                <th className="p-2 border-b border-slate-300 bg-slate-50 h-8">
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-[16.25px] font-medium leading-none text-[#23085A]">
                                            Actions
                                        </p>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExams.map((exam) => {
                                const isSelected = selectedType !== null && exam.type === selectedType;
                                return (
                                <tr key={exam.id} className={`h-8 transition-colors ${isSelected ? 'bg-gradient-to-r from-[#EFECF5] to-[#F3E5F5] hover:from-[#E1D4F0] hover:to-[#EAD9F3]' : 'hover:bg-slate-50'}`}>
                                    <td className="p-2 border-b border-t border-[#8E92BC] text-center">
                                        <p className="block text-[16.25px] text-slate-800">
                                            {exam.date}
                                        </p>
                                    </td>
                                    <td className="p-2 border-b border-t border-[#8E92BC] text-center">
                                        <div className="flex items-center justify-center">
                                            <PenIcon className="w-6 text-[#23085A]" />
                                            <p className="block text-[16.25px] text-slate-800">
                                                {exam.type}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-2 border-b border-t border-[#8E92BC] text-center">
                                        <p className="block text-[16.25px] text-slate-800">
                                            {exam.score}
                                        </p>
                                    </td>
                                    <td className="p-2 border-b border-t border-[#8E92BC] text-center">
                                        <p className="block text-[16.25px] text-slate-800">
                                            {exam.topic}
                                        </p>
                                    </td>
                                    <td className="p-2 border-b border-t border-[#8E92BC] text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="flex items-center gap-2 bg-gradient-to-r p-[1px] from-[#23085A] cursor-pointer to-[#651FFF] rounded-[9px]">
                                                <button
                                                    className="px-3 py-2 text-[16.25px] bg-white text-[#23085A] rounded-[8px] cursor-pointer hover:bg-purple-200 transition-colors"
                                                    onClick={() => console.log('View Q/A/Feedback for exam:', exam.id)}
                                                >
                                                    View Q/A/Feedback
                                                </button>
                                            </div>
                                            <button
                                                className="flex items-center gap-2 px-3 py-2 text-[16.25px] bg-[#F2F2F4] text-[#23085A] font-bold cursor-pointer rounded-md hover:bg-gray-200 transition-colors"
                                                onClick={() => console.log('Get Full Report for exam:', exam.id)}
                                            >
                                                Get Full Report
                                                <DownloadIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>


    )
}