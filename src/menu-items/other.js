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
  FilePdfOutlined
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
  FilePdfOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other = {
  id: 'mantenimiento',
  title: <FormattedMessage id="Mantenimiento" />,
  type: 'group',
  children: [
    {
      id: 'maintenance-request',
      title: 'Solicitud',
      type: 'item',
      url: '/mantenimiento/solicitud',
      icon: icons.FormOutlined
    },
    {
      id: 'maintenance-update',
      title: 'Actualización',
      type: 'item',
      url: '/mantenimiento/actualizacion',
      icon: icons.IssuesCloseOutlined
    },
    {
      id: 'maintenance-request-pdf',
      title: 'Solicitud',
      type: 'item',
      url: '/mantenimiento/pdf-solicitud',
      icon: icons.FilePdfOutlined
    }
    // {
    //   id: 'menu-level',
    //   title: <FormattedMessage id="menu-level" />,
    //   type: 'collapse',
    //   icon: icons.MenuUnfoldOutlined,
    //   children: [
    //     {
    //       id: 'menu-level-1.1',
    //       title: (
    //         <>
    //           <FormattedMessage id="level" /> 1
    //         </>
    //       ),
    //       type: 'item',
    //       url: '#'
    //     },
    //     {
    //       id: 'menu-level-1.2',
    //       title: (
    //         <>
    //           <FormattedMessage id="level" /> 1
    //         </>
    //       ),
    //       type: 'collapse',
    //       children: [
    //         {
    //           id: 'menu-level-2.1',
    //           title: (
    //             <>
    //               <FormattedMessage id="level" /> 2
    //             </>
    //           ),
    //           type: 'item',
    //           url: '#'
    //         },
    //         {
    //           id: 'menu-level-2.2',
    //           title: (
    //             <>
    //               <FormattedMessage id="level" /> 2
    //             </>
    //           ),
    //           type: 'collapse',
    //           children: [
    //             {
    //               id: 'menu-level-3.1',
    //               title: (
    //                 <>
    //                   <FormattedMessage id="level" /> 3
    //                 </>
    //               ),
    //               type: 'item',
    //               url: '#'
    //             },
    //             {
    //               id: 'menu-level-3.2',
    //               title: (
    //                 <>
    //                   <FormattedMessage id="level" /> 3
    //                 </>
    //               ),
    //               type: 'item',
    //               url: '#'
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   id: 'menu-level-subtitle',
    //   title: <FormattedMessage id="menu-level-subtitle" />,
    //   caption: <FormattedMessage id="menu-level-subtitle-caption" />,
    //   type: 'collapse',
    //   icon: icons.BoxPlotOutlined,
    //   children: [
    //     {
    //       id: 'sub-menu-level-1.1',
    //       title: (
    //         <>
    //           <FormattedMessage id="level" /> 1
    //         </>
    //       ),
    //       caption: <FormattedMessage id="menu-level-subtitle-item" />,
    //       type: 'item',
    //       url: '#'
    //     },
    //     {
    //       id: 'sub-menu-level-1.2',
    //       title: (
    //         <>
    //           <FormattedMessage id="level" /> 1
    //         </>
    //       ),
    //       caption: <FormattedMessage id="menu-level-subtitle-collapse" />,
    //       type: 'collapse',
    //       children: [
    //         {
    //           id: 'sub-menu-level-2.1',
    //           title: (
    //             <>
    //               <FormattedMessage id="level" /> 2
    //             </>
    //           ),
    //           caption: <FormattedMessage id="menu-level-subtitle-sub-item" />,
    //           type: 'item',
    //           url: '#'
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   id: 'disabled-menu',
    //   title: <FormattedMessage id="disabled-menu" />,
    //   type: 'item',
    //   url: '#',
    //   icon: icons.StopOutlined,
    //   disabled: true
    // },
    // {
    //   id: 'oval-chip-menu',
    //   title: <FormattedMessage id="oval-chip-menu" />,
    //   type: 'item',
    //   url: '#',
    //   icon: icons.BorderOutlined
    // },
    // {
    //   id: 'documentation',
    //   title: <FormattedMessage id="documentation" />,
    //   type: 'item',
    //   url: 'https://links.codedthemes.com/BQFrl',
    //   icon: icons.QuestionOutlined,
    //   external: true,
    //   target: true,
    //   chip: {
    //     label: 'gitbook',
    //     color: 'secondary',
    //     size: 'small'
    //   }
    // },
    // {
    //   id: 'roadmap',
    //   title: <FormattedMessage id="roadmap" />,
    //   type: 'item',
    //   url: 'https://links.codedthemes.com/RXnKQ',
    //   icon: icons.DeploymentUnitOutlined,
    //   external: true,
    //   target: true
    // }
  ]
};

export default other;
