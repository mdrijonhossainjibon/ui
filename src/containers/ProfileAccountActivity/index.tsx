import classnames from 'classnames';
import { NewTabPanel } from 'components';
import { getUserAgentBrowserAndDevice, localeDate } from 'helpers';
import { getUserActivity, selectUserActivity } from 'modules';
import { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

// tslint:disable-next-line: no-empty-interface
interface ProfileAccountActivityProps {}

export const ProfileAccountActivity: React.FC<ProfileAccountActivityProps> = () => {
	const intl = useIntl();
	const dispatch = useDispatch();

	const userActivity = useSelector(selectUserActivity);
	const [tabKeyActiveState, setTabkeyActiveState] = React.useState<string>('Activity');

	React.useEffect(() => {
		dispatch(getUserActivity({ page: 0, limit: 25 }));
	}, []);

	const renderResult = (result: string) => {
		const className = classnames({
			'td-pg-profile__activity-result-succeed':
				result === intl.formatMessage({ id: 'page.body.profile.content.result.succeed' }),
			'td-pg-profile__activity-result-failed':
				result === intl.formatMessage({ id: 'page.body.profile.content.result.failed' }) ||
				result === intl.formatMessage({ id: 'page.body.profile.content.result.denied' }),
		});

		return <span className={className}>{result}</span>;
	};

	const getResultOfUserAction = (value: string) => {
		switch (value) {
			case 'login':
				return intl.formatMessage({ id: 'page.body.profile.content.action.login' });
			case 'logout':
				return intl.formatMessage({ id: 'page.body.profile.content.action.logout' });
			case 'request QR code for 2FA':
				return intl.formatMessage({ id: 'page.body.profile.content.action.request2fa' });
			case 'enable 2FA':
				return intl.formatMessage({ id: 'page.body.profile.content.action.enable2fa' });
			case 'login::2fa':
				return intl.formatMessage({ id: 'page.body.profile.content.action.login.2fa' });
			case 'request password reset':
				return intl.formatMessage({ id: 'page.body.profile.content.action.requestPasswordReset' });
			case 'password reset':
				return intl.formatMessage({ id: 'page.body.profile.content.action.passwordReset' });
			default:
				return value;
		}
	};

	const renderData = (keyShow: 'browserName' | 'deviceName') => {
		return (
			<div className="td-pg-profile__inner">
				{userActivity.map((activity, i) => {
					const names = getUserAgentBrowserAndDevice(activity.user_agent);

					return (
						<div className="td-pg-profile__activity__item" key={i}>
							<div className="d-flex justify-content-between">
								<span className="td-pg-profile__activity__item__field--highlight">{names[keyShow]}</span>
								<span>
									{getResultOfUserAction(activity.action)}/
									{renderResult(
										intl.formatMessage({ id: `page.body.profile.content.result.${activity.result}` }),
									)}
								</span>
							</div>
							<div className="d-flex justify-content-between">
								<span>{activity.user_ip}</span> <span>{localeDate(activity.created_at, 'fullDate')}</span>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	const onChangeTabKey: TabsProps['onChange'] = key => {
		setTabkeyActiveState(key);
	};

	const TAB_LIST_INFO = [
		{
			label: intl.formatMessage({ id: 'page.profile.accountActivity.tab.activity' }),
			content: tabKeyActiveState === 'Activity' ? renderData('browserName') : null,
		},
		{
			label: intl.formatMessage({ id: 'page.profile.accountActivity.tab.device' }),
			content: tabKeyActiveState === 'Device' ? renderData('deviceName') : null,
		},
	];

	return (
		<div className="td-pg-profile--bg td-pg-profile--radius td-pg-profile__content__item td-pg-profile__activity">
			<NewTabPanel defaultActiveKey={tabKeyActiveState} onChange={onChangeTabKey}>
				{TAB_LIST_INFO.map(tabInfo => (
					<TabPane
						key={tabInfo.label}
						tab={tabInfo.label}
						style={{
							background: '#172B4C',
						}}
					>
						{tabInfo.content}
					</TabPane>
				))}
			</NewTabPanel>
		</div>
	);
};
