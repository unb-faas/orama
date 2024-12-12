import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import cloudFilled from '@iconify/icons-ant-design/cloud-filled';
import toolsIcon from '@iconify/icons-bi/tools';
import testIcon from '@iconify/icons-grommet-icons/test';
import percentIcon from '@iconify/icons-bi/percent';
import hammerIcon from '@iconify/icons-bi/hammer';
import dingtalkIcon from '@iconify/icons-ant-design/dingtalk';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'workers',
    path: '/dashboard/workers',
    icon: getIcon(hammerIcon)
  },
  {
    title: 'providers',
    path: '/dashboard/providers',
    icon: getIcon(cloudFilled)
  },
  {
    title: 'use cases',
    path: '/dashboard/usecases',
    icon: getIcon(toolsIcon)
  },
  {
    title: 'benchmarks',
    path: '/dashboard/benchmarks',
    icon: getIcon(testIcon)
  },
  {
    title: 'factorial designs',
    path: '/dashboard/factorialDesigns',
    icon: getIcon(percentIcon)
  },
  {
    title: 'code prediction',
    path: '/dashboard/codeprediction',
    icon: getIcon(dingtalkIcon)
  }
];

export default sidebarConfig;
