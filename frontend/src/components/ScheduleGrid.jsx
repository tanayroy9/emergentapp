import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ScheduleGrid({ channelId }) {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [programs, setPrograms] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    loadSchedule();
  }, [channelId, currentWeekStart]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/schedule?channel_id=${channelId}`);
      const items = response.data;
      
      // Load program details
      const programIds = [...new Set(items.map(item => item.program_id))];
      const programPromises = programIds.map(id => 
        axios.get(`${API}/programs/${id}`).catch(() => null)
      );
      const programResponses = await Promise.all(programPromises);
      
      const programsMap = {};
      programResponses.forEach((res, idx) => {
        if (res && res.data) {
          programsMap[programIds[idx]] = res.data;
        }
      });
      
      setPrograms(programsMap);
      setScheduleItems(items);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getScheduleForDay = (day) => {
    return scheduleItems.filter(item => {
      const itemDate = parseISO(item.start_time);
      return isSameDay(itemDate, day);
    }).sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="w-full" data-testid="schedule-grid">
      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="grid grid-cols-7 gap-3 min-w-full">
          {weekDays.map((day, idx) => {
            const daySchedule = getScheduleForDay(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={idx} 
                className={`bg-gray-800/30 rounded-lg p-3 border ${
                  isToday ? 'border-cyan-500 bg-cyan-500/5' : 'border-gray-700'
                }`}
                data-testid={`day-column-${idx}`}
              >
                <div className="text-center mb-3 pb-2 border-b border-gray-700">
                  <p className={`text-sm font-semibold ${
                    isToday ? 'text-cyan-400' : 'text-gray-400'
                  }`}>
                    {format(day, 'EEE')}
                  </p>
                  <p className={`text-lg font-bold ${
                    isToday ? 'text-white' : 'text-gray-300'
                  }`}>
                    {format(day, 'd')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  {daySchedule.length > 0 ? (
                    daySchedule.map((item) => {
                      const program = programs[item.program_id];
                      return (
                        <div 
                          key={item.id} 
                          className="bg-gray-900/50 rounded-lg p-2 border border-gray-700 hover:border-cyan-500/50 transition-colors"
                          data-testid={`schedule-item-${item.id}`}
                        >
                          <div className="flex items-start gap-2 mb-1">
                            <Clock size={12} className="text-cyan-400 mt-1 flex-shrink-0" />
                            <p className="text-xs text-cyan-400 font-medium">
                              {format(parseISO(item.start_time), 'HH:mm')}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-white line-clamp-2">
                            {program?.title || 'Loading...'}
                          </p>
                          {item.is_live && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                              LIVE
                            </span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-4">No programs</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="lg:hidden space-y-4">
        {weekDays.map((day, idx) => {
          const daySchedule = getScheduleForDay(day);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={idx} 
              className={`bg-gray-800/30 rounded-lg p-4 border ${
                isToday ? 'border-cyan-500 bg-cyan-500/5' : 'border-gray-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                <Calendar size={18} className="text-cyan-400" />
                <h3 className={`font-semibold ${
                  isToday ? 'text-cyan-400' : 'text-white'
                }`}>
                  {format(day, 'EEEE, MMM d')}
                </h3>
              </div>
              
              <div className="space-y-2">
                {daySchedule.length > 0 ? (
                  daySchedule.map((item) => {
                    const program = programs[item.program_id];
                    return (
                      <div 
                        key={item.id} 
                        className="bg-gray-900/50 rounded-lg p-3 border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-cyan-400 font-medium">
                            {format(parseISO(item.start_time), 'HH:mm')}
                          </p>
                          {item.is_live && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                              LIVE
                            </span>
                          )}
                        </div>
                        <p className="text-base font-semibold text-white">
                          {program?.title || 'Loading...'}
                        </p>
                        {program?.description && (
                          <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                            {program.description}
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No programs scheduled</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
