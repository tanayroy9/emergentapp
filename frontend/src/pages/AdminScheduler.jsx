import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar } from '../components/ui/calendar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { format, parseISO } from 'date-fns';
import { Plus, Trash2, LogOut, Calendar as CalendarIcon, Video, Tv } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminScheduler() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [tickers, setTickers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Forms
  const [programForm, setProgramForm] = useState({
    title: '',
    description: '',
    youtube_link: '',
    content_type: 'video',
    duration_seconds: 3600,
    tags: ''
  });
  
  const [scheduleForm, setScheduleForm] = useState({
    program_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    is_live: false
  });
  
  const [tickerForm, setTickerForm] = useState({
    text: '',
    priority: 5
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [channelsRes, tickersRes] = await Promise.all([
        axios.get(`${API}/channels`),
        axios.get(`${API}/ticker?active_only=false`)
      ]);
      
      setChannels(channelsRes.data);
      setTickers(tickersRes.data);
      
      if (channelsRes.data.length > 0) {
        setSelectedChannel(channelsRes.data[0]);
        loadChannelData(channelsRes.data[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    }
  };

  const loadChannelData = async (channelId) => {
    try {
      const [programsRes, scheduleRes] = await Promise.all([
        axios.get(`${API}/programs?channel_id=${channelId}`),
        axios.get(`${API}/schedule?channel_id=${channelId}`)
      ]);
      
      setPrograms(programsRes.data);
      setScheduleItems(scheduleRes.data);
    } catch (error) {
      console.error('Error loading channel data:', error);
    }
  };

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    
    if (!selectedChannel) {
      toast.error('Please select a channel');
      return;
    }
    
    try {
      await axios.post(`${API}/programs`, {
        ...programForm,
        channel_id: selectedChannel.id
      });
      
      toast.success('Program created successfully');
      setProgramForm({
        title: '',
        description: '',
        youtube_link: '',
        content_type: 'video',
        duration_seconds: 3600,
        tags: ''
      });
      loadChannelData(selectedChannel.id);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create program');
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    
    if (!selectedChannel) {
      toast.error('Please select a channel');
      return;
    }
    
    try {
      const startDateTime = new Date(`${scheduleForm.date}T${scheduleForm.start_time}:00`);
      const endDateTime = new Date(`${scheduleForm.date}T${scheduleForm.end_time}:00`);
      
      await axios.post(`${API}/schedule`, {
        program_id: scheduleForm.program_id,
        channel_id: selectedChannel.id,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        is_live: scheduleForm.is_live
      });
      
      toast.success('Schedule created successfully');
      setScheduleForm({
        program_id: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        start_time: '09:00',
        end_time: '10:00',
        is_live: false
      });
      setDialogOpen(false);
      loadChannelData(selectedChannel.id);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create schedule');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!confirm('Are you sure you want to delete this schedule item?')) return;
    
    try {
      await axios.delete(`${API}/schedule/${scheduleId}`);
      toast.success('Schedule deleted');
      loadChannelData(selectedChannel.id);
    } catch (error) {
      toast.error('Failed to delete schedule');
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    
    try {
      await axios.delete(`${API}/programs/${programId}`);
      toast.success('Program deleted');
      loadChannelData(selectedChannel.id);
    } catch (error) {
      toast.error('Failed to delete program');
    }
  };

  const handleCreateTicker = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`${API}/ticker`, tickerForm);
      toast.success('Ticker created successfully');
      setTickerForm({ text: '', priority: 5 });
      loadData();
    } catch (error) {
      toast.error('Failed to create ticker');
    }
  };

  const handleDeleteTicker = async (tickerId) => {
    try {
      await axios.delete(`${API}/ticker/${tickerId}`);
      toast.success('Ticker deleted');
      loadData();
    } catch (error) {
      toast.error('Failed to delete ticker');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  const todaySchedule = scheduleItems.filter(item => {
    const itemDate = new Date(item.start_time);
    return format(itemDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  }).sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-lg border-b border-cyan-500/30 sticky top-0 z-40" data-testid="admin-header">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Tv className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Nzuri TV Admin</h1>
                <p className="text-xs text-cyan-400">Scheduler Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Welcome, {user.name}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')}
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                data-testid="view-site-button"
              >
                View Site
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                data-testid="logout-button"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 mb-6" data-testid="admin-tabs">
            <TabsTrigger value="schedule" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="programs" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Programs
            </TabsTrigger>
            <TabsTrigger value="ticker" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Ticker
            </TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card className="bg-gray-800/50 border-cyan-500/20" data-testid="calendar-card">
                <CardHeader>
                  <CardTitle className="text-white">Select Date</CardTitle>
                  <CardDescription className="text-gray-400">View schedule for a specific day</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-gray-700"
                  />
                </CardContent>
              </Card>

              {/* Schedule List */}
              <Card className="lg:col-span-2 bg-gray-800/50 border-cyan-500/20" data-testid="schedule-list-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">
                        Schedule for {format(selectedDate, 'EEEE, MMM d, yyyy')}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {todaySchedule.length} programs scheduled
                      </CardDescription>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-cyan-500 hover:bg-cyan-600" data-testid="add-schedule-button">
                          <Plus size={16} className="mr-2" />
                          Add Schedule
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 text-white border-cyan-500/30">
                        <DialogHeader>
                          <DialogTitle>Schedule Program</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Add a program to the schedule
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateSchedule} className="space-y-4">
                          <div>
                            <Label>Program</Label>
                            <Select value={scheduleForm.program_id} onValueChange={(value) => setScheduleForm({...scheduleForm, program_id: value})}>
                              <SelectTrigger className="bg-gray-900 border-gray-700">
                                <SelectValue placeholder="Select program" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-900 border-gray-700">
                                {programs.map((program) => (
                                  <SelectItem key={program.id} value={program.id}>
                                    {program.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={scheduleForm.date}
                              onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                              className="bg-gray-900 border-gray-700"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Start Time</Label>
                              <Input
                                type="time"
                                value={scheduleForm.start_time}
                                onChange={(e) => setScheduleForm({...scheduleForm, start_time: e.target.value})}
                                className="bg-gray-900 border-gray-700"
                                required
                              />
                            </div>
                            <div>
                              <Label>End Time</Label>
                              <Input
                                type="time"
                                value={scheduleForm.end_time}
                                onChange={(e) => setScheduleForm({...scheduleForm, end_time: e.target.value})}
                                className="bg-gray-900 border-gray-700"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="is_live"
                              checked={scheduleForm.is_live}
                              onChange={(e) => setScheduleForm({...scheduleForm, is_live: e.target.checked})}
                              className="w-4 h-4"
                            />
                            <Label htmlFor="is_live">Mark as Live Stream</Label>
                          </div>
                          
                          <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600">
                            Create Schedule
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todaySchedule.length > 0 ? (
                      todaySchedule.map((item) => {
                        const program = programs.find(p => p.id === item.program_id);
                        return (
                          <div 
                            key={item.id} 
                            className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 flex items-center justify-between"
                            data-testid={`schedule-item-${item.id}`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-cyan-400 font-semibold">
                                  {format(parseISO(item.start_time), 'HH:mm')} - {format(parseISO(item.end_time), 'HH:mm')}
                                </span>
                                {item.is_live && (
                                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                    LIVE
                                  </span>
                                )}
                                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                                  item.status === 'running' ? 'bg-green-500 text-white' :
                                  item.status === 'completed' ? 'bg-gray-600 text-gray-300' :
                                  'bg-blue-500 text-white'
                                }`}>
                                  {item.status.toUpperCase()}
                                </span>
                              </div>
                              <h4 className="text-white font-semibold">{program?.title || 'Unknown Program'}</h4>
                              {program?.description && (
                                <p className="text-sm text-gray-400 mt-1">{program.description}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSchedule(item.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <CalendarIcon className="mx-auto mb-4 text-gray-600" size={48} />
                        <p className="text-gray-400">No programs scheduled for this day</p>
                        <p className="text-gray-500 text-sm mt-1">Click "Add Schedule" to create one</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Program Form */}
              <Card className="bg-gray-800/50 border-cyan-500/20" data-testid="create-program-card">
                <CardHeader>
                  <CardTitle className="text-white">Create Program</CardTitle>
                  <CardDescription className="text-gray-400">Add a new program to your library</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateProgram} className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Title</Label>
                      <Input
                        value={programForm.title}
                        onChange={(e) => setProgramForm({...programForm, title: e.target.value})}
                        className="bg-gray-900 border-gray-700 text-white"
                        required
                        data-testid="program-title-input"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Description</Label>
                      <Textarea
                        value={programForm.description}
                        onChange={(e) => setProgramForm({...programForm, description: e.target.value})}
                        className="bg-gray-900 border-gray-700 text-white"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">YouTube Link</Label>
                      <Input
                        value={programForm.youtube_link}
                        onChange={(e) => setProgramForm({...programForm, youtube_link: e.target.value})}
                        className="bg-gray-900 border-gray-700 text-white"
                        placeholder="https://www.youtube.com/embed/..."
                        data-testid="program-youtube-input"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Content Type</Label>
                      <Select value={programForm.content_type} onValueChange={(value) => setProgramForm({...programForm, content_type: value})}>
                        <SelectTrigger className="bg-gray-900 border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="live">Live Stream</SelectItem>
                          <SelectItem value="playlist">Playlist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Duration (seconds)</Label>
                      <Input
                        type="number"
                        value={programForm.duration_seconds}
                        onChange={(e) => setProgramForm({...programForm, duration_seconds: parseInt(e.target.value)})}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600" data-testid="create-program-button">
                      <Plus size={16} className="mr-2" />
                      Create Program
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Programs List */}
              <Card className="bg-gray-800/50 border-cyan-500/20" data-testid="programs-list-card">
                <CardHeader>
                  <CardTitle className="text-white">Program Library</CardTitle>
                  <CardDescription className="text-gray-400">{programs.length} programs available</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {programs.map((program) => (
                      <div 
                        key={program.id} 
                        className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 flex items-start justify-between"
                        data-testid={`program-${program.id}`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Video size={16} className="text-cyan-400" />
                            <h4 className="text-white font-semibold">{program.title}</h4>
                          </div>
                          {program.description && (
                            <p className="text-sm text-gray-400 mb-2">{program.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-gray-800 rounded">{program.content_type}</span>
                            {program.duration_seconds && (
                              <span>{Math.floor(program.duration_seconds / 60)} min</span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProgram(program.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Ticker Tab */}
          <TabsContent value="ticker">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Ticker Form */}
              <Card className="bg-gray-800/50 border-cyan-500/20" data-testid="create-ticker-card">
                <CardHeader>
                  <CardTitle className="text-white">Create Ticker</CardTitle>
                  <CardDescription className="text-gray-400">Add breaking news to the ticker</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTicker} className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Text</Label>
                      <Textarea
                        value={tickerForm.text}
                        onChange={(e) => setTickerForm({...tickerForm, text: e.target.value})}
                        className="bg-gray-900 border-gray-700 text-white"
                        required
                        rows={3}
                        data-testid="ticker-text-input"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Priority (lower = higher priority)</Label>
                      <Input
                        type="number"
                        value={tickerForm.priority}
                        onChange={(e) => setTickerForm({...tickerForm, priority: parseInt(e.target.value)})}
                        className="bg-gray-900 border-gray-700 text-white"
                        min="1"
                        max="10"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600" data-testid="create-ticker-button">
                      <Plus size={16} className="mr-2" />
                      Create Ticker
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Tickers List */}
              <Card className="bg-gray-800/50 border-cyan-500/20" data-testid="tickers-list-card">
                <CardHeader>
                  <CardTitle className="text-white">Active Tickers</CardTitle>
                  <CardDescription className="text-gray-400">{tickers.length} ticker items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {tickers.map((ticker) => (
                      <div 
                        key={ticker.id} 
                        className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 flex items-start justify-between"
                        data-testid={`ticker-${ticker.id}`}
                      >
                        <div className="flex-1">
                          <p className="text-white">{ticker.text}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">Priority: {ticker.priority}</span>
                            <span className={`px-2 py-1 text-xs rounded ${
                              ticker.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                            }`}>
                              {ticker.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTicker(ticker.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
