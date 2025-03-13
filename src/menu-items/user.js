// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  BorderOutlined,
  BoxPlotOutlined,
  ChromeOutlined,
  DeploymentUnitOutlined,
  GatewayOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
  SmileOutlined,
  StopOutlined,
  FormOutlined,
  IssuesCloseOutlined,
  FilePdfOutlined,
  SearchOutlined,
  FileSearchOutlined,
  DatabaseOutlined,
  UsergroupAddOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  TeamOutlined,
  LockOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

// icons
const icons = {
  ChromeOutlined,
  MenuUnfoldOutlined,
  BoxPlotOutlined,
  StopOutlined,
  BorderOutlined,
  SmileOutlined,
  GatewayOutlined,
  QuestionOutlined,
  DeploymentUnitOutlined,
  FormOutlined,
  IssuesCloseOutlined,
  FilePdfOutlined,
  SearchOutlined,
  FileSearchOutlined,
  DatabaseOutlined,
  UsergroupAddOutlined,
  UserSwitchOutlined,
  SettingOutlined,
  TeamOutlined,
  LockOutlined,
  SafetyCertificateOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other = {
  id: 'users',
  title: <FormattedMessage id="Administración" />,
  type: 'group',
  children: [
    {
      id: 'user-roles',
      title: 'Roles y usuarios',
      type: 'item',
      url: '/roles/usuarios',
      icon: icons.TeamOutlined
    }
  ]
};

export default other;
