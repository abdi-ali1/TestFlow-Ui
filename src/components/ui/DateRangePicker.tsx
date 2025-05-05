import React, { useState } from 'react';
import Button from './Button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (range: { start: string, end: string }) => void;
  onClose: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  onClose
}) => {
  const [selectedStart, setSelectedStart] = useState(startDate);
  const [selectedEnd, setSelectedEnd] = useState(endDate);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const handleDateClick = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(dateStr);
      setSelectedEnd('');
    } else if (dateStr > selectedStart) {
      setSelectedEnd(dateStr);
    } else {
      setSelectedEnd(selectedStart);
      setSelectedStart(dateStr);
    }
  };
  
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const applyRange = () => {
    if (selectedStart && selectedEnd) {
      onChange({ start: selectedStart, end: selectedEnd });
    } else if (selectedStart) {
      onChange({ start: selectedStart, end: selectedStart });
    }
  };
  
  const days = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-80">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h3 className="text-gray-800 font-medium">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-gray-500 text-xs py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2"></div>
        ))}
        
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = dateStr === selectedStart || dateStr === selectedEnd;
          const inRange = selectedStart && selectedEnd && dateStr > selectedStart && dateStr < selectedEnd;
          
          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`p-2 rounded-full text-sm text-center
                ${isSelected ? 'bg-blue-600 text-white' : ''}
                ${inRange ? 'bg-blue-100' : ''}
                ${!isSelected && !inRange ? 'hover:bg-gray-100' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-gray-50 rounded text-sm">
            <div className="text-gray-500 text-xs">Start Date</div>
            <div>{selectedStart || 'Select'}</div>
          </div>
          <div className="p-2 bg-gray-50 rounded text-sm">
            <div className="text-gray-500 text-xs">End Date</div>
            <div>{selectedEnd || 'Select'}</div>
          </div>
        </div>
        
        <div className="flex justify-between gap-2 mt-2">
          <Button
            variant="outline"
            small
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            small
            onClick={applyRange}
            disabled={!selectedStart}
            icon={<Calendar className="h-4 w-4" />}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;