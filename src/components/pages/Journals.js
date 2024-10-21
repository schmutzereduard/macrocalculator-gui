import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';
import { fetchJournal, fetchJournals } from '../../features/journalsSlice';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import Loading from '../misc/Loading';
import Journal from '../modal/Journal';

function Journals() {

    const dispatch = useDispatch();
    const { items: journals, loading } = useSelector(state => state.journals);
    const [isJournalModalOpen, setJournalModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    useEffect(() => {
        const year = format(currentDate, 'yyyy');
        const month = format(currentDate, 'MM');
        dispatch(fetchJournals({ year: year, month: month }));
    }, [dispatch, currentDate]);

    const handleYearChange = (event) => {
        const year = event.target.value;
        const newDate = new Date(year, currentDate.getMonth(), 1);
        setCurrentDate(newDate);
    };

    const handleMonthChange = (event) => {
        const month = event.target.value - 1;
        const newDate = new Date(currentDate.getFullYear(), month, 1);
        setCurrentDate(newDate);
    };

    const handleDayClick = (date) => {
        const year = format(date, 'yyyy');
        const month = format(date, 'MM');
        const day = format(date, 'dd');
        dispatch(fetchJournal({ year: year, month: month, day: day }));
        setJournalModalOpen(true);
    };

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    });

    const isJournalAvailable = (date) => {
        return journals.some(journal => journal.date === format(date, 'yyyy-MM-dd'));
    };

    const closeJournalModal = () => {
        setJournalModalOpen(false);
    };

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <div className="header">
                        <select value={currentDate.getFullYear()} onChange={handleYearChange}>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <select value={currentDate.getMonth() + 1} onChange={handleMonthChange}>
                            {months.map(month => (
                                <option key={month} value={month}>{format(new Date(2000, month - 1), 'MMMM')}</option>
                            ))}
                        </select>
                    </div>
                    <div className="calendar">
                        {daysInMonth.map(day => (
                            <div 
                                key={day} 
                                className={`day ${isSameMonth(day, currentDate) ? '' : 'disabled'} ${isToday(day) ? 'today' : ''} ${isJournalAvailable(day) ? 'journal-available' : ''}`}
                                onClick={() => handleDayClick(day)}
                            >
                                {format(day, 'd')}
                            </div>
                        ))}
                    </div>
                    <ReactModal isOpen={isJournalModalOpen} onRequestClose={closeJournalModal}>
                        <Journal onClose={closeJournalModal} />
                    </ReactModal>
                </div>
            )}
        </div>
    )
}

export default Journals;