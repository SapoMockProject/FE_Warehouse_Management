import type { DateRange } from "../types/DateFieldProps";

export const getDateFilterOptions = () => {
    return [
        { value: 'today', label: 'Hôm nay' },
        { value: 'yesterday', label: 'Hôm qua' },
        { value: '7days', label: '7 ngày qua' },
        { value: '30days', label: '30 ngày qua' },
        { value: 'thisweek', label: 'Tuần trước' },
        { value: 'lastweek', label: 'Tuần này' },
        { value: 'thismonth', label: 'Tháng trước' },
        { value: 'lastmonth', label: 'Tháng này' },
        { value: 'thisyear', label: 'Năm trước' },
        { value: 'lastyear', label: 'Năm nay' },
    ];
}

export const getDateRange = (days: number): DateRange => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - days);
    return {
        start: start.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
    };
};

export const calculateDateRange = (preset: string): DateRange | undefined => {
    let range: DateRange;

    if (preset === 'custom') {
        const today = new Date().toISOString().split('T')[0];
        range = { start: today, end: today };

    } else {
        switch (preset) {
            case 'today':
                {
                    const today = new Date().toISOString().split('T')[0];
                    range = { start: today, end: today };
                    break;
                }
            case 'yesterday':
                range = getDateRange(1);
                break;
            case '7days':
                range = getDateRange(7);
                break;
            case '30days':
                range = getDateRange(30);
                break;
            case 'thisweek':
                {
                    const todayDate = new Date();
                    const firstDay = new Date(todayDate.setDate(todayDate.getDate() - todayDate.getDay()));
                    range = {
                        start: firstDay.toISOString().split('T')[0],
                        end: new Date().toISOString().split('T')[0]
                    };
                    break;
                }
            case 'lastweek':
                {
                    const lastWeekEnd = new Date();
                    lastWeekEnd.setDate(lastWeekEnd.getDate() - lastWeekEnd.getDay() - 1);
                    const lastWeekStart = new Date(lastWeekEnd);
                    lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
                    range = {
                        start: lastWeekStart.toISOString().split('T')[0],
                        end: lastWeekEnd.toISOString().split('T')[0]
                    };
                    break;
                }
            case 'thismonth':
                {
                    const thisMonthStart = new Date();
                    thisMonthStart.setDate(1);
                    range = {
                        start: thisMonthStart.toISOString().split('T')[0],
                        end: new Date().toISOString().split('T')[0]
                    };
                    break;
                }
            case 'lastmonth':
                {
                    const lastMonthEnd = new Date();
                    lastMonthEnd.setDate(0);
                    const lastMonthStart = new Date(lastMonthEnd);
                    lastMonthStart.setDate(1);
                    range = {
                        start: lastMonthStart.toISOString().split('T')[0],
                        end: lastMonthEnd.toISOString().split('T')[0]
                    };
                    break;
                }
            case 'thisyear':
                {
                    const thisYearStart = new Date();
                    thisYearStart.setMonth(0, 1);
                    range = {
                        start: thisYearStart.toISOString().split('T')[0],
                        end: new Date().toISOString().split('T')[0]
                    };
                    break;
                }
            case 'lastyear':
                {
                    const lastYearStart = new Date();
                    lastYearStart.setFullYear(lastYearStart.getFullYear() - 1, 0, 1);
                    const lastYearEnd = new Date();
                    lastYearEnd.setFullYear(lastYearEnd.getFullYear() - 1, 11, 31);
                    range = {
                        start: lastYearStart.toISOString().split('T')[0],
                        end: lastYearEnd.toISOString().split('T')[0]
                    };
                    break;
                }
            default:
                range = { start: '', end: '' };
        }
        return { ...range, preset };
    }
};

export const formatDateTime = (dateString?: string | null): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return "N/A";
  }
};

