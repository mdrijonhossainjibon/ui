import classnames from 'classnames';
import { NewTabPanel } from 'components';
import { HistoryTable } from 'mobile/components/HistoryTable';
import { Subheader } from 'mobile/components/Subheader';
import { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

// tslint:disable-next-line: no-empty-interface
interface WalletHistoryProps {}

export const NewWalletHistoryMobileScreen: React.FC<WalletHistoryProps> = ({}) => {
	const intl = useIntl();
	const history = useHistory();

	const [currentTabIndex, setCurrentTabIndex] = React.useState<number>(0);

	const TAB_LIST_INFO = [
		{
			content: currentTabIndex === 0 ? <HistoryTable type="deposits" /> : null,
			label: (i: number) => {
				const classActive = classnames('wallet-history-mobile-title', {
					'wallet-history-mobile-title__deposit-active': i === 0,
				});
				return <div className={classActive}>{intl.formatMessage({ id: 'page.mobile.wallets.deposit.history' })}</div>;
			},
		},
		{
			content: currentTabIndex === 1 ? <HistoryTable type="withdraws" /> : null,
			label: (i: number) => {
				const classActive = classnames('wallet-history-mobile-title', {
					'wallet-history-mobile-title__withdraw-active': i === 1,
				});
				return <div className={classActive}>{intl.formatMessage({ id: 'page.mobile.wallets.withdraw.history' })}</div>;
			},
		},
	];

	const onChangeTabIndex: TabsProps['onChange'] = key => {
		setCurrentTabIndex(Number(key));
	};

	return (
		<div className="td-mobile-screen-wallet-history">
			<Subheader title={intl.formatMessage({ id: 'page.body.wallet.history.header' })} onGoBack={() => history.goBack()} />
			<NewTabPanel onChange={onChangeTabIndex}>
				{TAB_LIST_INFO.map((tabInfo, i) => (
					<TabPane key={i} tab={tabInfo.label(i)}>
						{tabInfo.content}
					</TabPane>
				))}
			</NewTabPanel>
		</div>
	);
};
