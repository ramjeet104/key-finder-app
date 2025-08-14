import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scan, CheckCircle, XCircle, Camera as CameraIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface KeyMatch {
  id: string;
  name: string;
  confidence: number;
  isCorrect: boolean;
}

const KeyScanner: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<KeyMatch | null>(null);

  // Reference keys for comparison (mock data)
  const referenceKeys = [
    { id: '1', name: 'Master Key #5', pattern: 'silver_key_5', isCorrect: true },
    { id: '2', name: 'Access Key #3', pattern: 'gold_key_3', isCorrect: false },
  ];

  const analyzeKey = async (imageData: string): Promise<KeyMatch> => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis - in real app, this would use computer vision
    const hasNumber5 = Math.random() > 0.3; // Simulate detection
    const isSilver = Math.random() > 0.4;
    
    if (hasNumber5 && isSilver) {
      return {
        id: '1',
        name: 'Master Key #5',
        confidence: 92,
        isCorrect: true
      };
    } else {
      return {
        id: '2',
        name: 'Unknown Key',
        confidence: 67,
        isCorrect: false
      };
    }
  };

  const capturePhoto = async () => {
    try {
      setIsScanning(true);
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        setCapturedImage(image.dataUrl);
        toast.success('Photo captured! Analyzing...');
        
        const result = await analyzeKey(image.dataUrl);
        setScanResult(result);
        
        if (result.isCorrect) {
          toast.success(`Correct key identified: ${result.name}`);
        } else {
          toast.error('Key not recognized or incorrect');
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      toast.error('Failed to capture photo');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        setIsScanning(true);
        
        toast.success('Image uploaded! Analyzing...');
        
        const result = await analyzeKey(imageData);
        setScanResult(result);
        setIsScanning(false);
        
        if (result.isCorrect) {
          toast.success(`Correct key identified: ${result.name}`);
        } else {
          toast.error('Key not recognized or incorrect');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setScanResult(null);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-metallic-bronze bg-clip-text text-transparent">
          Key Scanner
        </h1>
        <p className="text-muted-foreground">
          Scan your key to verify its authenticity
        </p>
      </div>

      {/* Scanner Area */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-card to-accent/20 border-primary/20">
        <div className="aspect-square bg-muted/30 flex items-center justify-center relative">
          {capturedImage ? (
            <div className="relative w-full h-full">
              <img 
                src={capturedImage} 
                alt="Captured key" 
                className="w-full h-full object-contain rounded-lg"
              />
              {isScanning && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Scan className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Position key within the frame
              </p>
            </div>
          )}
          
          {/* Scanner overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
          </div>
        </div>
      </Card>

      {/* Results */}
      {scanResult && (
        <Card className="p-4 space-y-3 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Scan Result</h3>
            {scanResult.isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Key Type:</span>
              <span className="font-medium">{scanResult.name}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <Badge variant={scanResult.confidence > 85 ? "default" : "secondary"}>
                {scanResult.confidence}%
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge variant={scanResult.isCorrect ? "default" : "destructive"}>
                {scanResult.isCorrect ? "Correct" : "Incorrect"}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {!capturedImage ? (
          <>
            <Button 
              onClick={capturePhoto} 
              disabled={isScanning}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              size="lg"
            >
              <CameraIcon className="w-5 h-5 mr-2" />
              {isScanning ? 'Scanning...' : 'Scan Key'}
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              <Button variant="outline" className="w-full" size="lg">
                <Upload className="w-5 h-5 mr-2" />
                Upload Image
              </Button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={capturePhoto} 
              disabled={isScanning}
              variant="outline"
            >
              <Scan className="w-4 h-4 mr-2" />
              Scan Again
            </Button>
            
            <Button 
              onClick={resetScanner}
              variant="outline"
            >
              Reset
            </Button>
          </div>
        )}
      </div>

      {/* Reference Keys */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Reference Keys</h3>
        <div className="space-y-2">
          {referenceKeys.map((key) => (
            <div key={key.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
              <span className="text-sm">{key.name}</span>
              <Badge variant={key.isCorrect ? "default" : "secondary"}>
                {key.isCorrect ? "Target" : "Other"}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default KeyScanner;