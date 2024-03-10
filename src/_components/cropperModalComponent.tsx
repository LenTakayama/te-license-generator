import Cropper, { Area, MediaSize } from 'react-easy-crop';
import Modal from 'react-modal';
import {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from 'react';
import getCroppedImg from '../_utils/getCroppedImg';
import styles from './cropperModalComponent.module.css';

const ASPECT_RATIO = 3 / 4;
const CROP_WIDTH = 300;
const customStyles = {
  content: {},
};
Modal.setAppElement('main');

type Props = {
  croppedImg: HTMLImageElement | null;
  setCroppedImg: Dispatch<SetStateAction<HTMLImageElement | null>>;
  open: boolean;
  onClose: () => void;
};

export default function CropperModalComponent(props: Props) {
  /** 画像の拡大縮小倍率 */
  const [zoom, setZoom] = useState(1);
  /** 画像拡大縮小の最小値 */
  const [minZoom, setMinZoom] = useState(1);

  /** 切り取る領域の情報 */
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  /** 切り取る領域の情報 */
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  /**
   * Cropper側で画像データ読み込み完了
   * Zoomの最小値をセットしZoomの値も更新
   */
  const onMediaLoaded = useCallback((mediaSize: MediaSize) => {
    const { width, height } = mediaSize;
    const mediaAspectRadio = width / height;
    if (mediaAspectRadio > ASPECT_RATIO) {
      // 縦幅に合わせてZoomを指定
      const result = CROP_WIDTH / ASPECT_RATIO / height;
      setZoom(result);
      setMinZoom(result);
      return;
    }
    // 横幅に合わせてZoomを指定
    const result = CROP_WIDTH / width;
    setZoom(result);
    setMinZoom(result);
  }, []);

  /**
   * 切り取り完了後、切り取り領域の情報をセット
   */
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  /**
   * 切り取り後の画像を生成し画面に表示
   */
  const showCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return;
    if (props.croppedImg) {
      try {
        const croppedImage = await getCroppedImg(
          props.croppedImg,
          croppedAreaPixels,
        );
        const img = new Image();
        img.src = croppedImage;
        img.onload = () => props.setCroppedImg(img);
      } catch (e) {
        console.error(e);
      }
    }
  }, [croppedAreaPixels, props.croppedImg]);

  return (
    <Modal
      isOpen={props.open}
      onRequestClose={props.onClose}
      className={styles.modal_root}
      style={customStyles}
      ariaHideApp={props.open}
    >
      <div className={styles.modal}>
        <div className={styles.crop_container}>
          <div className={styles.crop_space}>
            <Cropper
              image={props.croppedImg?.src}
              crop={crop}
              zoom={zoom}
              minZoom={minZoom}
              maxZoom={minZoom + 3}
              aspect={ASPECT_RATIO}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              cropSize={{
                width: 400,
                height: 520,
              }}
              classes={{
                containerClassName: styles.container,
                cropAreaClassName: styles.crop_area,
                mediaClassName: styles.media,
              }}
              onMediaLoaded={onMediaLoaded}
              showGrid={true}
            />
          </div>
        </div>
        <div className={styles.controls}>
          <input
            type="range"
            min={minZoom}
            value={zoom}
            max={minZoom + 3}
            step={0.1}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setZoom(Number(e.currentTarget.value));
            }}
            className={styles.zoom_range}
          />
          <div className={styles.buttons}>
            <button className={styles.close} onClick={props.onClose}>
              Close
            </button>
            <button
              className={styles.ok}
              onClick={() => {
                props.onClose();
                showCroppedImage();
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
