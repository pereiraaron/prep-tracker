import { Box, Grid, Text } from '@chakra-ui/react'
import { LuPlus, LuArchive, LuChartBar, LuListTodo } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

const ACTIONS = [
  {
    icon: <LuPlus size={20} />,
    title: 'New Task',
    description: 'Create a new prep task',
    path: '/tasks/new',
    color: 'purple.500',
  },
  {
    icon: <LuArchive size={20} />,
    title: 'Add to Backlog',
    description: 'Save questions for later',
    path: '/backlog',
    color: 'blue.500',
  },
  {
    icon: <LuChartBar size={20} />,
    title: 'View Stats',
    description: 'Track your progress',
    path: '/stats',
    color: 'green.500',
  },
  {
    icon: <LuListTodo size={20} />,
    title: 'All Tasks',
    description: 'Manage your tasks',
    path: '/tasks',
    color: 'orange.500',
  },
]

const QuickActions = () => {
  const navigate = useNavigate()

  return (
    <Grid
      templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
      gap={{ base: 3, md: 4 }}
    >
      {ACTIONS.map((action) => (
        <Box
          key={action.title}
          bg="bg.card"
          borderWidth="1px"
          borderColor="border.card"
          borderRadius="xl"
          p={{ base: 4, md: 5 }}
          cursor="pointer"
          _hover={{ borderColor: 'purple.500/40', bg: 'purple.500/5' }}
          onClick={() => navigate(action.path)}
        >
          <Box color={action.color} mb={2}>
            {action.icon}
          </Box>
          <Text fontSize="sm" fontWeight="semibold">
            {action.title}
          </Text>
          <Text fontSize="xs" color="fg.muted" mt={0.5}>
            {action.description}
          </Text>
        </Box>
      ))}
    </Grid>
  )
}

export default QuickActions
