import Tabs, { TabsProps } from 'rc-tabs';
import * as React from 'react';

// tslint:disable-next-line: no-empty-interface
interface NewTabPanelProps {}

type Props = TabsProps & NewTabPanelProps;

export const NewTabPanel: React.FC<Props> = ({ children, ...props }) => {
	return (
		<Tabs prefixCls={'td-tabs'} {...props}>
			{children}
		</Tabs>
	);
};
