import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { fetchDayPlan, fetchMonthPlans } from '../../store/actions/planActions';
import { showEditPlanModal, hideEditPlanModal } from '../../store/actions/modal/edit';
import EditPlanModal from '../modal/EditPlanModal';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

const Planner = ({ onEditPlan, onCancelEditPlan }) => {
    const dispatch = useDispatch();
    const plans = useSelector(state => state.plans.plans);
    const selectedPlan = useSelector(state => state.plans.plan);
    const isEditPlanModalOpen = useSelector(state => state.editModal.isEditPlanModalOpen);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    useEffect(() => {
        const year = format(currentDate, 'yyyy');
        const month = format(currentDate, 'MM');
        dispatch(fetchMonthPlans(year, month));
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
        dispatch(fetchDayPlan(year, month, day));
        dispatch(showEditPlanModal());
    };

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    });

    const isPlanAvailable = (date) => {
        return plans.some(plan => plan.date === format(date, 'yyyy-MM-dd'));
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
                        className={`day ${isSameMonth(day, currentDate) ? '' : 'disabled'} ${isToday(day) ? 'today' : ''} ${isPlanAvailable(day) ? 'plan-available' : ''}`}
                        onClick={() => handleDayClick(day)}
                    >
                        {format(day, 'd')}
                    </div>
                ))}
            </div>
            {isEditPlanModalOpen && (
                <EditPlanModal 
                    isOpen={isEditPlanModalOpen}
                    onRequestClose={onCancelEditPlan}
                    plan={selectedPlan}
                />
            )}
        </div>
    );
};

const mapDispatchToProps = (dispatch) => ({
    onEditPlan: () => dispatch(showEditPlanModal()),
    onCancelEditPlan: () => dispatch(hideEditPlanModal())
});

export default connect(null, mapDispatchToProps)(Planner);
