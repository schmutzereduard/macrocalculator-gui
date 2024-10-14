import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { fetchDayJournal, fetchMonthJournals } from '../../store/actions/journalActions';
import { showEditJournalModal, hideEditJournalModal } from '../../store/actions/modal/edit';
import EditJournalModal from '../modal/EditJournalModal';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

const Journals = ({ onEditJournal, onCancelEditJournal }) => {
    const dispatch = useDispatch();
    const journals = useSelector(state => state.journals.journals);
    const selectedJournal = useSelector(state => state.journals.journal);
    const isEditJournalModalOpen = useSelector(state => state.editModal.isEditJournalModalOpen);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    useEffect(() => {
        const year = format(currentDate, 'yyyy');
        const month = format(currentDate, 'MM');
        dispatch(fetchMonthJournals(year, month));
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
        setSelectedDate(date);
        dispatch(fetchDayJournal(year, month, day));
        dispatch(showEditJournalModal());
    };

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    });

    const isJournalAvailable = (date) => {
        return journals.some(journal => journal.date === format(date, 'yyyy-MM-dd'));
    };

    return (
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
            {isEditJournalModalOpen && (
                <EditJournalModal 
                    isOpen={isEditJournalModalOpen}
                    onRequestClose={onCancelEditJournal}
                    journal={selectedJournal}
                />
            )}
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onEditJournal: () => dispatch(showEditJournalModal()),
    onCancelEditJournal: () => dispatch(hideEditJournalModal())
});

export default connect(null, mapDispatchToProps)(Journals);
