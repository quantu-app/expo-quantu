import React, { memo, useMemo, useState } from "react";
import { toDataURL, QRCodeToDataURLOptions } from "qrcode";
import { Image } from "react-native";

export interface IQRCodeProps {
  uri: string;
  size?: number;
}

export const QRCode = memo((props: IQRCodeProps) => {
  const [dataURL, setDataURL] = useState<string | undefined>(),
    size = props.size || 512;

  useMemo(() => {
    toDataURL(props.uri, {
      width: size,
      height: size,
    } as QRCodeToDataURLOptions).then(setDataURL);
  }, [props.uri, size]);

  return (
    <Image source={{ uri: dataURL }} style={{ width: size, height: size }} />
  );
});
