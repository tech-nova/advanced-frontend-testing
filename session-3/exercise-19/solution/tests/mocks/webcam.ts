import { Page } from '@playwright/test';

/**
 * The mockWebcam function is used to mock a webcam for testing purposes.
 * It replaces the global MediaRecorder with a mock version that simulates video recording.
 * We have to do this because we don't have a real webcam available during testing.
 */
export async function mockWebcam(page: Page) {
  await page.evaluate(() => {
    const FRAME_RATE = 30;
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d')!;

    // Mock getUserMedia to simulate a webcam
    navigator.mediaDevices.getUserMedia = async () => {
      return canvas.captureStream(FRAME_RATE);
    };

    // Mock MediaRecorder to simulate video recording
    class MockMediaRecorder {
      private chunks: Blob[] = [];
      ondataavailable: ((event: BlobEvent) => void) | null =
        null;
      onstop: (() => void) | null = null;
      state: 'inactive' | 'recording' = 'inactive';

      constructor(private stream: MediaStream) {}

      start() {
        this.state = 'recording';
        this.recordFrame();
      }

      private recordFrame() {
        if (this.state === 'recording') {
          ctx.fillStyle = `rgb(${Math.random() * 255},${
            Math.random() * 255
          },${Math.random() * 255})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            if (blob) {
              this.chunks.push(blob);
              if (this.ondataavailable) {
                this.ondataavailable(
                  new BlobEvent('dataavailable', {
                    data: blob,
                  })
                );
              }
            }
            setTimeout(
              () => this.recordFrame(),
              1000 / FRAME_RATE
            );
          }, 'video/mp4');
        }
      }

      stop() {
        this.state = 'inactive';
        const finalBlob = new Blob(this.chunks, {
          type: 'video/mp4',
        });

        // Save it to the global scope
        // @ts-ignore
        window.mockVideoBlob =
          URL.createObjectURL(finalBlob);

        if (this.ondataavailable) {
          this.ondataavailable(
            new BlobEvent('dataavailable', {
              data: finalBlob,
            })
          );
        }
      }
    }

    // Replace the global MediaRecorder with our mock version
    window.MediaRecorder = MockMediaRecorder as any;
  });
}
