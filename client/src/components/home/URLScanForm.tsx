import { useState, FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ScanResult {
  url: string;
  isSafe: boolean;
  message: string;
  timestamp?: number;
}

interface URLScanFormProps {
  onScanComplete?: (scanResult: ScanResult) => void;
}

export function URLScanForm({ onScanComplete }: URLScanFormProps = {}) {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const { toast } = useToast();

  const scanMutation = useMutation({
    mutationFn: async (urlToScan: string): Promise<ScanResult> => {
      const response = await apiRequest('POST', '/api/scan', { url: urlToScan });
      return response.json();
    },
    onSuccess: (data) => {
      // Call the callback if provided
      if (onScanComplete) {
        onScanComplete(data);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to scan URL: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const validateUrl = (input: string): boolean => {
    try {
      new URL(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    
    if (inputUrl.length > 0) {
      setIsValidUrl(validateUrl(inputUrl));
    } else {
      setIsValidUrl(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!url) {
      setIsValidUrl(false);
      return;
    }

    if (validateUrl(url)) {
      scanMutation.mutate(url);
    } else {
      setIsValidUrl(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto md:mx-0">
      <form id="scan-form" className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <div className="flex">
            <div className="relative flex-1">
              <input 
                type="url" 
                id="url-input" 
                className={`w-full px-4 py-3 border ${
                  isValidUrl === false ? 'border-danger-500' : isValidUrl ? 'border-success-500' : 'border-gray-300'
                } rounded-l-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all duration-200 pr-10`}
                placeholder="Enter a URL (e.g., https://example.com)" 
                value={url}
                onChange={handleUrlChange}
                required
              />
              {isValidUrl && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <i className="fas fa-check-circle text-success-500 text-lg"></i>
                </div>
              )}
            </div>
            <button 
              type="submit" 
              className={`bg-primary-700 hover:bg-primary-800 text-white px-6 py-3 rounded-r-md transition-colors font-medium flex items-center justify-center min-w-[120px] ${
                scanMutation.isPending ? 'opacity-75' : ''
              }`}
              disabled={scanMutation.isPending}
            >
              {scanMutation.isPending ? (
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              ) : null}
              <span>Scan URL</span>
            </button>
          </div>
          {isValidUrl === false && (
            <p className="text-sm text-danger-700 mt-1">Please enter a valid URL including http:// or https://</p>
          )}
        </div>
      </form>
      
      {/* Results section */}
      {scanMutation.isPending && (
        <div className="mt-6">
          <div className="flex flex-col items-center py-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-700"></div>
            <p className="text-neutral-600 mt-3">Analyzing URL safety...</p>
          </div>
        </div>
      )}
      
      {scanMutation.isSuccess && (
        <div className="mt-6">
          {scanMutation.data.isSafe ? (
            <div className="rounded-md border border-success-500 bg-success-50 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-shield-check text-success-500 text-xl"></i>
                </div>
                <div className="ml-3">
                  <h3 className="text-success-700 font-medium">URL is Safe</h3>
                  <div className="mt-2 text-sm text-neutral-700">
                    <p>This website appears to be legitimate and safe to visit.</p>
                    <div className="mt-3">
                      <a 
                        href={scanMutation.data.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-success-500 hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500"
                      >
                        Visit Website Safely
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-danger-500 bg-danger-50 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-triangle text-danger-500 text-xl"></i>
                </div>
                <div className="ml-3">
                  <h3 className="text-danger-700 font-medium">Warning: Potentially Unsafe</h3>
                  <div className="mt-2 text-sm text-neutral-700">
                    <p>This website shows signs of being a phishing attempt or contains malicious content.</p>
                    <div className="mt-3">
                      <a 
                        href={scanMutation.data.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-danger-500 hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500"
                      >
                        Proceed with Caution
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
