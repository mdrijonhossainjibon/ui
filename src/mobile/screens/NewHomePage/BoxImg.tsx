import { LoadingMobile } from 'mobile/components';
import * as React from 'react';
import { useSelector } from 'react-redux';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { EventItem, selectEvents } from '../../../modules';

const settings: Settings = {
	dots: false,
	infinite: true,
	arrows: false,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 2500,
};

const SlideImg: React.FC = () => {
	const eventsData = useSelector(selectEvents).payload;

	const renderElms = (paramsEventsDat: EventItem[]) =>
		paramsEventsDat.map((event, i) => (
			<a rel="noopener noreferrer" href={event.ref_link} target="_blank" key={i}>
				<img src={event.image_link} alt={event.description} />
			</a>
		));

	if (!eventsData.length) {
		return <LoadingMobile />;
	}

	return <Slider {...settings}>{renderElms(eventsData)}</Slider>;
};

export const BoxImg = React.memo(SlideImg);
