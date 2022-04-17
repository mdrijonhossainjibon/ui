import { ListIcon, SpeakIcon } from 'mobile/assets/icons';
import * as React from 'react';
import { Link } from 'react-router-dom';

// tslint:disable-next-line: no-empty-interface
interface AnnouncmentProps {}

export const Announcment: React.FC<AnnouncmentProps> = ({}) => {
	return (
		<div className="td-mobile-screen-home__announcment">
			<div>
				<SpeakIcon />
			</div>
			<div className="td-mobile-screen-home__announcment__slider">
				<div className="td-mobile-screen-home__announcment__slider__inner"></div>
			</div>
			<div>
				<Link to="/announcement">
					<ListIcon />
				</Link>
			</div>
		</div>
	);
};
