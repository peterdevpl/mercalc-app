import styles from './switchButtons.module.css';

export default function SwitchButtons({ options, selected, onChange }: { options: Map<string, string>, selected: string, onChange: any }) {
  const buttons: any[] = [];
  options.forEach((value, key) => {
    buttons.push({ key, value });
  });

  return (
    <div className={styles.switchButtons}>
      {buttons.map(button => (
        <button type="button"
                key={button.key}
                className={button.key === selected ? styles.switchButtonSelected : ''}
                onClick={() => onChange(button.key)}>{button.value}</button>
      ))}
    </div>
  );
}
