import { ChangeEvent, Dispatch, SetStateAction } from 'react';

type Props = {
  className: string;
  elementName: string;
  text: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

export default function InputTextComponent(props: Props) {
  const handleChangeEvent = (e: ChangeEvent<HTMLInputElement>) => {
    props.setValue(e.target.value);
  };
  return (
    <>
      <label htmlFor={props.elementName} className={props.className}>
        {props.text}
        <input
          type="text"
          name={props.elementName}
          id={props.elementName}
          value={props.value}
          onChange={handleChangeEvent}
        />
      </label>
    </>
  );
}
