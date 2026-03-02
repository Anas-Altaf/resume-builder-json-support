

const DateRange = ({ startYear, endYear, id }) => {
    if (!startYear && !endYear) return null;

    let display = "";
    if (startYear && endYear) {
        display = `${startYear} - ${endYear}`;
    } else if (startYear) {
        display = startYear;
    } else {
        display = endYear;
    }

    return (
        <p id={id} className="sub-content">
            {display}
        </p>
    );
};

export default DateRange;