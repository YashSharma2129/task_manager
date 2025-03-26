import React from 'react';
import { Grid, Paper, Typography, LinearProgress, Box } from '@mui/material';
import { format } from 'date-fns';

const TaskStatistics = ({ tasks, theme }) => {
  const getTaskStatistics = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const dueTodayTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return format(dueDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    }).length;

    const overdueTasksCount = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate < today;
    }).length;

    return { completedTasks, totalTasks, pendingTasks, completionRate, dueTodayTasks, overdueTasksCount };
  };

  const stats = getTaskStatistics();

  const statsData = [
    { title: 'Total Tasks', value: stats.totalTasks, color: '#2196f3' },
    { title: 'Completed', value: stats.completedTasks, color: '#4caf50' },
    { title: 'Pending', value: stats.pendingTasks, color: '#ff9800' },
    { title: 'Due Today', value: stats.dueTodayTasks, color: '#9c27b0' },
    { title: 'Overdue', value: stats.overdueTasksCount, color: '#f44336' }
  ];

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: `linear-gradient(45deg, ${stat.color}22 30%, ${stat.color}11 90%)`,
                border: `1px solid ${stat.color}33`,
              }}
            >
              <Typography variant="h4" sx={{ color: stat.color, fontWeight: 'bold' }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Overall Progress</Typography>
        <LinearProgress 
          variant="determinate" 
          value={stats.completionRate} 
          sx={{ 
            height: 10, 
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              borderRadius: 5
            }
          }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {Math.round(stats.completionRate)}% Complete
        </Typography>
      </Box>
    </>
  );
};

export default TaskStatistics;