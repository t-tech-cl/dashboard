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
  UsergroupAddOutlined
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
  UsergroupAddOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other = {
  id: 'users',
  title: <FormattedMessage id="Gestión de Usuarios" />,
  type: 'group',
  children: [
    {
      id: 'user-roles',
      title: 'Manejo de Roles',
      type: 'item',
      url: '/roles/usuarios',
      icon: icons.UsergroupAddOutlined
    }
  ]
};

export default other;
