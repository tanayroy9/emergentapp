import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ScheduleGrid({ channelId, nowPlaying }) {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [programs, setPrograms] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentWeekStart] = useState(new Date());
  const [expandedDays, setExpandedDays] = useState({});

  useEffect(() => {
    if (channelId) {
      loadSchedule();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/schedule?channel_id=${channelId}`);
      const items = response.data;
      
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
      
      // Auto-expand today
      const today = format(new Date(), 'yyyy-MM-dd');
      setExpandedDays({ [today]: true });
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

  const toggleDay = (dayStr) => {
    setExpandedDays(prev => ({ ...prev, [dayStr]: !prev[dayStr] }));
  };

  const isCurrentlyPlaying = (item) => {
    if (!nowPlaying?.schedule_item) return false;
    return nowPlaying.schedule_item.id === item.id;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3" data-testid="schedule-grid">
      {weekDays.map((day, idx) => {
        const daySchedule = getScheduleForDay(day);
        const isToday = isSameDay(day, new Date());
        const dayStr = format(day, 'yyyy-MM-dd');
        const isExpanded = expandedDays[dayStr];
        
        return (
          <div 
            key={idx} 
            className={`bg-gray-800/30 rounded-lg border ${
              isToday ? 'border-cyan-500 bg-cyan-500/5' : 'border-gray-700'
            }`}
            data-testid={`day-column-${idx}`}
          >
            {/* Day Header - Clickable */}
            <button
              onClick={() => toggleDay(dayStr)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar size={20} className={isToday ? 'text-cyan-400' : 'text-gray-400'} />
                <div className="text-left">
                  <h3 className={`font-bold text-lg ${
                    isToday ? 'text-cyan-400' : 'text-white'
                  }`}>
                    {format(day, 'EEEE, MMM d')}
                  </h3>
                  <p className="text-xs text-gray-400">{daySchedule.length} programs</p>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="text-cyan-400" size={24} />
              ) : (
                <ChevronDown className="text-gray-400" size={24} />
              )}
            </button>

            {/* Schedule Items - Collapsible */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-2 max-h-96 overflow-y-auto">
                {daySchedule.length > 0 ? (
                  daySchedule.map((item) => {
                    const program = programs[item.program_id];
                    const isPlaying = isCurrentlyPlaying(item);
                    
                    return (
                      <div 
                        key={item.id} 
                        className={`rounded-lg p-3 border transition-all ${
                          isPlaying 
                            ? 'bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/50 animate-pulse' 
                            : 'bg-gray-900/50 border-gray-700 hover:border-cyan-500/50'
                        }`}
                        data-testid={`schedule-item-${item.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <Clock size={16} className={isPlaying ? 'text-cyan-400' : 'text-gray-400'} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`text-sm font-medium ${
                                isPlaying ? 'text-cyan-400' : 'text-cyan-400'
                              }`}>
                                {format(parseISO(item.start_time), 'HH:mm')} - {format(parseISO(item.end_time), 'HH:mm')}
                              </p>
                              {isPlaying && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded animate-pulse">
                                  LIVE NOW
                                </span>
                              )}
                              {item.is_live && !isPlaying && (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                                  LIVE
                                </span>
                              )}
                            </div>
                            <p className={`text-sm font-semibold ${
                              isPlaying ? 'text-white' : 'text-white'
                            }`}>
                              {program?.title || 'Loading...'}
                            </p>
                            {program?.description && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                {program.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No programs scheduled</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
