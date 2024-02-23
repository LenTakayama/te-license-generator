'use client';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import { Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google';
import InputTextComponent from '@/_components/inputTextComponent';

const NotoSansFont = Noto_Sans_JP({
  display: 'swap',
  preload: false,
  weight: '400',
  subsets: ['latin'],
});
const NotoSerifFont = Noto_Serif_JP({
  display: 'swap',
  weight: '700',
  preload: false,
  subsets: ['latin'],
});

export default function Home() {
  const [png, setPng] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [faceImageState, setFaceImageState] = useState<HTMLImageElement | null>(
    null,
  );
  const [numberState, setNumberState] = useState<string>('');
  const [birthDateState, setBirthDateState] = useState<string>('');
  const [bloodTypeState, setBloodTypeState] = useState<string>('');
  const [nameJpState, setNameJpState] = useState<string>('');
  const [nameEnState, setNameEnState] = useState<string>('');
  const [departmentState, setDepartmentState] = useState<string>('');

  useEffect(() => {
    const templatePng = new Image();
    templatePng.src = '/lisence.png';
    templatePng.onload = () => {
      canvasRef.current!.height = templatePng.height;
      canvasRef.current!.width = templatePng.width;
      const ctx = canvasRef.current!.getContext('2d')!;
      ctx.drawImage(templatePng, 0, 0);
      drawText(
        numberState,
        `30px ${NotoSansFont.style.fontFamily}`,
        canvasRef.current!.height * 0.86,
        canvasRef.current!.width * 0.245,
      );
      drawText(
        birthDateState,
        `30px ${NotoSerifFont.style.fontFamily}`,
        canvasRef.current!.height * 0.86,
        canvasRef.current!.width * 0.296,
      );
      drawText(
        bloodTypeState,
        `30px ${NotoSerifFont.style.fontFamily}`,
        canvasRef.current!.height * 0.86,
        canvasRef.current!.width * 0.347,
      );
      drawText(
        nameJpState,
        `55px ${NotoSerifFont.style.fontFamily}`,
        canvasRef.current!.height * 0.86,
        canvasRef.current!.width * 0.42,
      );
      drawText(
        nameEnState,
        `27px ${NotoSerifFont.style.fontFamily}`,
        canvasRef.current!.height * 0.86,
        canvasRef.current!.width * 0.47,
      );
      drawText(
        departmentState,
        `34px ${NotoSerifFont.style.fontFamily}`,
        canvasRef.current!.height * 0.89,
        canvasRef.current!.width * 0.583,
      );
      if (faceImageState) {
        drawImg(faceImageState, 62, 243, 345, 345);
      }
      setPng(canvasRef.current!.toDataURL());
    };
  });

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileData = e.target.files![0];
    if (!fileData.type.match('image.*')) {
      alert('画像を選択してください');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const facePng = new Image();
      const fileData = e.target!.result;
      if (typeof fileData == 'string') {
        facePng.src = fileData;
        facePng.onload = () => {
          setFaceImageState(facePng);
        };
      }
    };
    reader.readAsDataURL(fileData);
  };

  const onClickButton = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const drawText = (text: string, font: string, x: number, y: number) => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const ctx = canvasElement.getContext('2d')!;
      ctx.font = font;
      ctx.fillStyle = '#DCDCDC';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y);
    } else {
      console.log('no hit');
    }
  };
  const drawImg = (
    img: HTMLImageElement,
    x: number,
    y: number,
    dWidth: number,
    dHeight: number,
  ) => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      const ctx = canvasElement.getContext('2d')!;
      ctx.drawImage(img, x, y, dWidth, dHeight);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          このサイトではGoogleアナリティクスを使っています。サイトの最適化やどれくらいこのジェネレータが使われているか見るためです。これを拒否する場合クッキーの利用を拒否してください。
          サイト管理人：高山蓮(X @Len_Takayama)より
        </p>
      </div>

      <div>
        <h1 className={styles.center}>
          環境庁神祇部職員証『非公式』ジェネレーター
        </h1>
        <div>
          {png && (
            <>
              <img className={styles.grid} src={png} alt="職員証の画像" />
              <a
                href={canvasRef.current!.toDataURL('image/png')}
                download="license.png"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.center}
              >
                画像保存
              </a>
            </>
          )}
        </div>
        <div className={styles.grid}>
          <div className={styles.card}>
            <input
              type="file"
              ref={inputFileRef}
              onChange={onChangeFile}
              hidden
            />
            <button onClick={onClickButton}>顔写真を選択してください</button>
          </div>
          <InputTextComponent
            className={styles.card}
            elementName="number"
            text="識別番号："
            value={numberState}
            setValue={setNumberState}
          />
          <InputTextComponent
            className={styles.card}
            elementName="birth_date"
            text="生年月日："
            value={birthDateState}
            setValue={setBirthDateState}
          />
          <InputTextComponent
            className={styles.card}
            elementName="blood_type"
            text="血液型："
            value={bloodTypeState}
            setValue={setBloodTypeState}
          />
          <InputTextComponent
            className={styles.card}
            elementName="name_jp"
            text="氏名："
            value={nameJpState}
            setValue={setNameJpState}
          />
          <InputTextComponent
            className={styles.card}
            elementName="name_en"
            text="英語氏名："
            value={nameEnState}
            setValue={setNameEnState}
          />
          <InputTextComponent
            className={styles.card}
            elementName="department"
            text="部署名：神祇部"
            value={departmentState}
            setValue={setDepartmentState}
          />
        </div>
        <p>
          本家様：
          <a
            href="https://twitter.com/cr_mkdk/status/1757739585969463709"
            target="_blank"
            rel="noopener noreferrer"
          >
            タクティカル職員証
          </a>
        </p>
        <p>
          庁内撮影顔写真（Picrew・タクティカル祓魔師メーカー）：
          <a
            href="https://picrew.me/ja/image_maker/2301923"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://picrew.me/ja/image_maker/2301923
          </a>
        </p>
        <p>
          タクティカル祓魔師・創作ガイド：
          <a
            href="https://note.com/cr_mkdk/n/na3a887ce3f37"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://note.com/cr_mkdk/n/na3a887ce3f37
          </a>
        </p>
        <p>
          タクティカル祓魔師公式Wiki：
          <a
            href="https://w.atwiki.jp/nandayo"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://w.atwiki.jp/nandayo
          </a>
        </p>
      </div>

      <div hidden>
        <canvas id="license_canvas" ref={canvasRef}></canvas>
      </div>
    </main>
  );
}
