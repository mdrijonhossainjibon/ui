import { Button, Checkbox, Form, FormInstance, Input } from 'antd';
import { isEmail, isValidPassword, setDocumentTitle } from 'helpers';
import { History } from 'history';
import { IntlProps } from 'index';
import { GoBackIcon } from 'mobile/assets/icons';
import { Configs, entropyPasswordFetch, LanguageState, RootState, selectConfigs, selectCurrentLanguage, signUp } from 'modules';
import React from 'react';
import isEqual from 'react-fast-compare';
import ReCAPTCHA, { ReCAPTCHAProps } from 'react-google-recaptcha';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { GeetestCaptcha } from './../../../containers/GeetestCaptcha/index';
import {
	selectCurrentPasswordEntropy,
	selectSignUpError,
	selectSignUpRequireVerification,
} from './../../../modules/user/auth/selectors';

const RenderCapchaComponent: React.FC<{
	renderCapcha: JSX.Element | null;
}> = ({ renderCapcha }) => {
	return <>{renderCapcha}</>;
};

const RenderCapcha = React.memo(RenderCapchaComponent, isEqual);
interface ReduxProps {
	configs: Configs;
	requireVerification?: boolean;
	loading?: boolean;
	currentPasswordEntropy: number;
}

interface DispatchProps {
	signUp: typeof signUp;
	fetchCurrentPasswordEntropy: typeof entropyPasswordFetch;
}

interface RouterProps {
	location: {
		search: string;
	};
	history: History;
}

interface OwnProps {
	signUpError: boolean;
	i18n: LanguageState['lang'];
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps & OwnProps;
interface FormRegisterState {
	email: string | null;
	pass: string | null;
	confirm: string | null;
	isCheckTerms: boolean;
	statusCapcha: boolean;
	refId: string | null;
	shouldGeetestReset: boolean;
}

//TODO: Bad code form controller
class FormRegister extends React.Component<Props, FormRegisterState> {
	public readonly state: FormRegisterState = {
		email: null,
		pass: null,
		confirm: null,
		isCheckTerms: false,
		statusCapcha: false,
		refId: null,
		shouldGeetestReset: false,
	};

	public constructor(props) {
		super(props);
		this.reCaptchaRef = React.createRef();
		this.geetestCaptchaRef = React.createRef();
		this.formRef = React.createRef();
	}

	private formRef: React.RefObject<FormInstance<any>>;
	private reCaptchaRef: React.RefObject<ReCAPTCHA>;
	private geetestCaptchaRef: React.RefObject<ReCAPTCHA>;

	public componentDidMount() {
		setDocumentTitle(this.props.intl.formatMessage({ id: 'page.header.signUp' }));
		const localReferralCode = localStorage.getItem('referralCode');
		const refId = this.extractRefIDs(this.props.location.search);
		const referralCode = refId || localReferralCode || '';
		this.formRef.current &&
			this.formRef.current.setFieldsValue({
				referral_code: referralCode,
			});
		this.setState({
			refId: referralCode,
		});
		if (refId && refId !== localReferralCode) {
			localStorage.setItem('referralCode', referralCode);
		}
	}

	public componentWillReceiveProps(nextProps: Props) {
		const { email } = this.state;

		if (nextProps.requireVerification) {
			nextProps.history.push('/email-verification', { email: email });
		}

		if (nextProps.signUpError) {
			if (this.reCaptchaRef.current) {
				this.reCaptchaRef.current.reset();
			}

			if (this.geetestCaptchaRef.current) {
				this.setState({ shouldGeetestReset: true });
			}
		}
	}

	public render() {
		const { history, configs, intl } = this.props;
		const { email, pass, confirm, isCheckTerms, refId, statusCapcha, shouldGeetestReset } = this.state;
		const canSubmit = () => {
			const checkCaptcha = () => {
				switch (configs.captcha_type) {
					case 'recaptcha':
						return statusCapcha;
					case 'geetest':
						return !shouldGeetestReset;
					default:
						return true;
				}
			};

			return (
				email !== null &&
				isEmail(email) &&
				pass !== null &&
				isValidPassword(pass) &&
				pass === confirm &&
				isCheckTerms &&
				checkCaptcha()
			);
		};

		return (
			<div className="td-mobile-screen-register">
				<div className="td-mobile-screen-register__header">
					<GoBackIcon onClick={() => history.goBack()} />
				</div>
				<div className="td-mobile-screen-register__body">
					<Form
						ref={this.formRef}
						className="td-mobile-screen-register__body__form w-100"
						layout="vertical"
						onFinish={this.onSubmit}
					>
						<h4 className="td-mobile-screen-register__body__form__title">
							{intl.formatMessage({ id: 'page.mobile.home.signUp.title' })}
						</h4>
						<span className="td-mobile-screen-register__body__form__description">
							{intl.formatMessage({ id: 'page.mobile.home.signUp.welcome' })}
						</span>
						<Form.Item
							className="td-mobile-screen-register__body__form__label"
							label={intl.formatMessage({ id: 'page.mobile.home.signUp.email' })}
							name="email"
							hasFeedback
							help={email !== null && !isEmail(email) ? 'Email invalid!' : undefined}
							validateStatus={email === null ? '' : isEmail(email) ? 'success' : 'error'}
						>
							<Input
								className="td-mobile-screen-register__body__form__label__input"
								value={email || ''}
								placeholder={intl.formatMessage({ id: 'page.mobile.home.signUp.emailInput' })}
								onChange={e =>
									this.setState({
										email: e.target.value,
									})
								}
							/>
						</Form.Item>

						<Form.Item
							className="td-mobile-screen-register__body__form__label"
							label={intl.formatMessage({ id: 'page.mobile.home.signUp.password' })}
							name="password"
							hasFeedback
							help={
								pass !== null && !isValidPassword(pass)
									? 'Pass must have at least 1 digit, 1 upper and 1 lower.'
									: undefined
							}
							validateStatus={pass === null ? '' : isValidPassword(pass) ? 'success' : 'error'}
						>
							<Input.Password
								className="td-mobile-screen-register__body__form__label__input"
								value={pass || ''}
								placeholder={intl.formatMessage({ id: 'page.mobile.home.signUp.passwordInput' })}
								onChange={e =>
									this.setState({
										pass: e.target.value,
									})
								}
							/>
						</Form.Item>

						<Form.Item
							className="td-mobile-screen-register__body__form__label"
							label={intl.formatMessage({ id: 'page.mobile.home.signUp.comfirm' })}
							name="confirm"
							hasFeedback
							help={confirm !== null && confirm !== pass ? 'Confirm password does not same' : undefined}
							validateStatus={confirm === null ? '' : confirm !== pass ? 'error' : 'success'}
						>
							<Input.Password
								className="td-mobile-screen-register__body__form__label__input"
								value={confirm || ''}
								placeholder={intl.formatMessage({ id: 'page.mobile.home.signUp.comfirmInput' })}
								onChange={e =>
									this.setState({
										confirm: e.target.value,
									})
								}
							/>
						</Form.Item>

						<Form.Item
							className="td-mobile-screen-register__body__form__label"
							label={intl.formatMessage({ id: 'page.mobile.home.signUp.referral' })}
							name="referral_code"
						>
							<Input
								className="td-mobile-screen-register__body__form__label__input"
								value={refId || ''}
								placeholder={intl.formatMessage({ id: 'page.mobile.home.signUp.referralInput' })}
								onChange={e =>
									this.setState({
										refId: e.target.value,
									})
								}
							/>
						</Form.Item>

						<Form.Item name="remember" valuePropName="checked">
							<Checkbox
								className="td-mobile-screen-register__body__form__checkbox"
								value={isCheckTerms}
								onChange={e =>
									this.setState({
										isCheckTerms: e.target.checked,
									})
								}
							>
								{intl.formatMessage({ id: 'page.mobile.home.signUp.agree' })}
							</Checkbox>
						</Form.Item>

						<div className="td-mobile-screen-register__body__form__recaptcha">
							<RenderCapcha renderCapcha={this.renderRecapcha()} />
						</div>

						<Form.Item className="td-mobile-screen-register__body__form__submit">
							<Button
								className="td-mobile-screen-register__body__form__submit__btn"
								htmlType="submit"
								type="primary"
								disabled={!canSubmit()}
							>
								{intl.formatMessage({ id: 'page.mobile.home.signUp.signUp' })}
							</Button>
						</Form.Item>

						<div className="td-mobile-screen-register__body__form__to-login">
							<span>{intl.formatMessage({ id: 'page.mobile.home.signUp.already' })}</span>{' '}
							<Link className="td-mobile-screen-register__body__form__to-login__link" to="/login">
								{intl.formatMessage({ id: 'page.mobile.home.signUp.login' })}
							</Link>
						</div>
					</Form>
				</div>
				<div className="td-mobile-screen-register__footer">
					{intl.formatMessage({ id: 'page.mobile.home.signUp.footer' })}
				</div>
			</div>
		);
	}

	private handleReCaptchaSuccess: ReCAPTCHAProps['onChange'] = () => {
		this.setState({
			statusCapcha: true,
		});
	};

	private handleGeetestCaptchaSuccess = () => {
		this.setState({
			shouldGeetestReset: false,
		});
	};

	private renderRecapcha = () => {
		const { configs } = this.props;
		const { shouldGeetestReset } = this.state;

		switch (configs.captcha_type) {
			case 'recaptcha':
				if (configs.captcha_id) {
					return (
						<ReCAPTCHA
							theme="dark"
							ref={this.reCaptchaRef}
							sitekey={String(configs.captcha_id)}
							onChange={this.handleReCaptchaSuccess}
						/>
					);
				}
				return null;
			case 'geetest':
				return (
					<GeetestCaptcha
						ref={() => this.geetestCaptchaRef}
						shouldCaptchaReset={shouldGeetestReset}
						onSuccess={this.handleGeetestCaptchaSuccess}
					/>
				);
			default:
				return null;
		}
	};

	private onSubmit = (value: any) => {
		const { refId, email, pass } = this.state;
		const { i18n } = this.props;
		if (refId) {
			this.props.signUp({
				email: email || '',
				password: pass || '',
				data: JSON.stringify({
					language: i18n,
				}),
				refid: refId,
			});
		} else {
			this.props.signUp({
				email: email || '',
				password: pass || '',
				data: JSON.stringify({
					language: i18n,
				}),
			});
		}

		if (this.reCaptchaRef.current) {
			this.reCaptchaRef.current.reset();
		}
		if (this.geetestCaptchaRef.current) {
			this.setState({
				shouldGeetestReset: true,
			});
		}
		this.setState({
			statusCapcha: false,
		});
	};

	private extractRefIDs = (url: string) => new URLSearchParams(url).get('refid');
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
	configs: selectConfigs(state),
	i18n: selectCurrentLanguage(state),
	requireVerification: selectSignUpRequireVerification(state),
	signUpError: selectSignUpError(state),
	currentPasswordEntropy: selectCurrentPasswordEntropy(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
	signUp: credentials => dispatch(signUp(credentials)),
	fetchCurrentPasswordEntropy: payload => dispatch(entropyPasswordFetch(payload)),
});

export const NewSignUpMobileScreen = compose(
	injectIntl,
	withRouter,
	connect(mapStateToProps, mapDispatchToProps),
)(FormRegister) as React.ComponentClass;
