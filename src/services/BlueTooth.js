import { useState } from 'react';
import { Buffer } from 'buffer';
import { BleManager } from 'react-native-ble-plx';
import { useQrCode } from '../hooks/qrcode';
import { useBluetooth } from '../hooks/bluetooth';

export default function useBlueToothScan() {
  const [loading, setLoading] = useState(false);
  const manager = new BleManager();

  const qrcode = useQrCode();
  const bluetooth = useBluetooth();

  function stopScan() {
    manager.stopDeviceScan();
    setLoading(false);
  }

  function scanTag() {
    const tagName = qrcode.device;
    const start = performance.now();
    let run = 0;
    manager.stopDeviceScan();

    console.log('procurando tag: ' + tagName); // 00005242-0000-1000-8000-00805f9b34fb
    manager.startDeviceScan(null, { scanMode: 2 }, (error, device) => {
      if (error) {
        console.log('Erro:' + error);
      }
      console.log(device.id);
      if (device.name == tagName) {
        manager.stopDeviceScan();
        return readDevice(device);
      }
      run = performance.now();
      if (run - start > 15000) {
        return;
      }
    });
  }

  async function readDevice(device) {
    const buf = Buffer.from(device.manufacturerData, 'base64');
    const uint16array = new Uint8Array(
      buf.buffer,
      buf.byteOffset,
      buf.length / Uint8Array.BYTES_PER_ELEMENT
    );
    qrcode.storeRead('true');
    const text = buf.toString('hex');
    const tempUuid = text.slice(8, 40);

    const majorMult = uint16array[20] * 256;
    const majorSum = majorMult + uint16array[21];

    const minorMult = uint16array[22] * 256;
    const minorSum = minorMult + uint16array[23];
    bluetooth.storeName(device.name);
    bluetooth.storeMajor(String(majorSum));
    bluetooth.storeMinor(String(minorSum));
    bluetooth.storeId(device.id);

    return tempUuid;
  }

  return [scanTag, stopScan, loading];
}
