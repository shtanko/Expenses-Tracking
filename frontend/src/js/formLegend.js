import React from 'react';


const getFormLegend = function(title, col) {
	return (
		<div className="row">
			<div className={col}>
				<legend><h2>{title}</h2></legend>
			</div>
		</div>
	);
};

export default getFormLegend;