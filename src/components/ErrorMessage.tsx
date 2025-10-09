import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  // Determine error type based on the error message
  const isInvalidUrl = error.includes("valid URL") || error.includes("Please enter a URL");
  const isNetworkError = error.includes("Failed to generate") || error.includes("network") || error.includes("connection");

  const getErrorMessage = () => {
    if (isInvalidUrl) {
      return {
        title: "Invalid URL Format",
        description: (
          <div className='space-y-2'>
            <p>Please enter a valid URL. URLs should start with http:// or https://</p>
            <div className='text-sm'>
              <p className='font-medium mb-1'>Examples of valid URLs:</p>
              <ul className='list-disc list-inside space-y-1 text-muted-foreground'>
                <li>https://example.com</li>
                <li>http://www.example.com</li>
                <li>https://example.com/path</li>
                <li>example.com (will be automatically prefixed with https://)</li>
              </ul>
            </div>
          </div>
        ),
      };
    }

    if (isNetworkError) {
      return {
        title: "Connection Error",
        description: (
          <div className='space-y-2'>
            <p>Unable to generate QR code. Please check your internet connection and try again.</p>
            <p className='text-sm text-muted-foreground'>If the problem persists, make sure the backend server is running.</p>
          </div>
        ),
      };
    }

    // Default error message
    return {
      title: "Error",
      description: error,
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <Alert variant='destructive' className='border-destructive/50'>
      <AlertCircle className='h-4 w-4' />
      <AlertDescription className='space-y-3'>
        <div>
          <p className='font-medium'>{errorInfo.title}</p>
          {errorInfo.description}
        </div>
        {isNetworkError && onRetry && (
          <Button
            onClick={onRetry}
            variant='outline'
            size='sm'
            className='border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground'
          >
            <RefreshCw className='mr-2 h-4 w-4' />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
