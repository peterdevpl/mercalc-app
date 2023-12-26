const monthNames: string[] = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];

export default function MonthYearSelector({ id, values, onChange }: { id: string, values: string[], onChange: any }) {
  const getSingleYear = (monthYearValues: string[]): string | undefined => {
    let lastYear = undefined;
    let year;
    for (const monthYear of monthYearValues) {
      year = monthYear.substring(0, 4);
      if (lastYear === undefined) {
        lastYear = year;
      } else if (lastYear !== year) {
        return undefined;
      }
    }
    return lastYear;
  };

  const singleYear = getSingleYear(values);
  const items: any[] = [];

  let monthIndex;
  for (let i = values.length - 1; i >= 0; i--) {
    monthIndex = parseInt(values[i].substring(5, 7)) - 1;
    items.push({
      value: values[i],
      text: monthNames[monthIndex] + (singleYear ? '' : ' ' + values[i].substring(0, 4))
    });
  }

  return (
    <>
      <select id={id} onChange={onChange}>
        {items.map(item => {
          return (
            <option key={item.value} value={item.value}>{item.text}</option>
          );
        })}
      </select>
      {singleYear && <span className="year">&nbsp;{singleYear}</span>}
    </>
  );
}
