import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUserLoggedIn } from '../../../modules';
import { Avatar } from '../../assets/icons';

const HeaderComponent: React.FC = () => {
	const userLoggedIn = useSelector(selectUserLoggedIn);
	const intl = useIntl();
	const Logo = require('../../assets/images/Udonlogo.svg');

	return (
		<div className="pg-mobile-cpn-header">
			<div className="pg-mobile-cpn-header__inner">
				<Link to="/" className="pg-mobile-cpn-header__logo">
					<img src={Logo} alt="" className="pg-logo__img" />
				</Link>
				<div className="pg-mobile-cpn-header__account">
					{userLoggedIn ? (
						<Link to="/profile" className="pg-mobile-cpn-header__account__profile">
							<Avatar className="pg-mobile-cpn-header__account__profile__icon" />
						</Link>
					) : (
						<Link to="/login" className="pg-mobile-cpn-header__account__log-in">
							<button className="btn btn-block" type="button">
								{intl.formatMessage({ id: 'page.mobile.header.signIn' })}
							</button>
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export const Header = React.memo(HeaderComponent);
