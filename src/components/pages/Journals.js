import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { fetchJournal, fetchJournals } from '../../features/journalsSlice';
import ReactModal from 'react-modal';
import Loading from '../misc/Loading';
import Journal from '../modal/Journal';
import useModals from "../../hooks/useModals";

function Journals() {

    const dispatch = useDispatch();
    const { items: journals, loading } = useSelector(state => state.journals);
    const [ currentDate, setCurrentDate ] = useState(new Date());
    const { modals, openModal, closeModal } = useModals();

    useEffect(() => {
        const year = format(currentDate, 'yyyy');
        const month = format(currentDate, 'MM');
        dispatch(fetchJournals({ year, month }));
    }, [dispatch, currentDate]);


    const openJournalModal = (date) => {

        const year = format(date, 'yyyy');
        const month = format(date, 'MM');
        const day = format(date, 'dd');
        dispatch(fetchJournal({
            year: year,
            month: month,
            day: day
        }));
        openModal("editJournal");
    };

    const closeJournalModal = () => {

        closeModal("editJournal");
    };

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <Calendar
                        journals={journals}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        handleDayClick={openJournalModal}
                    />
                    <ReactModal
                        isOpen={modals.editJournal?.isOpen}
                        onRequestClose={closeJournalModal}
                        //remove or move to css file
                        style={{
                            content: {
                                width: 'auto',       // Allows the width to grow based on content
                                maxWidth: '80%',     // Optional: Limits the max width to 80% of the viewport
                                margin: '0 auto',    // Centers the modal horizontally
                                padding: '20px'      // Adds padding around the content
                            }
                        }}>
                        <Journal onClose={closeJournalModal}/>
                    </ReactModal>
                </div>
            )}
        </div>
    )
}

function Calendar({ journals , currentDate, setCurrentDate, handleDayClick }) {

    const dateConfig = {
        years: Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i),
        months: Array.from({ length: 12 }, (_, i) => i + 1),
    };

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    });

    const handleYearChange = (event) => {

        const year = event.target.value;
        setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    };

    const handleMonthChange = (event) => {

        const month = event.target.value - 1;
        setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    };

    const isJournalAvailable = (date) => {

        return journals.some(journal => journal.date === format(date, 'yyyy-MM-dd'));
    };

    return (
        <div>
            <div className="header">
                <select value={currentDate.getFullYear()} onChange={handleYearChange}>
                    {dateConfig.years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <select value={currentDate.getMonth() + 1} onChange={handleMonthChange}>
                    {dateConfig.months.map(month => (
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
        </div>
    );
}

export default Journals;