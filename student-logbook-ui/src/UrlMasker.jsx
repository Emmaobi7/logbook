import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UrlMasker = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const pathname = location.pathname;

    // Handle direct navigation to /preceptor/... by redirecting to /supervisor/...
    if (pathname.startsWith('/preceptor')) {
      const realPath = pathname.replace('/preceptor', '/supervisor');
      navigate(realPath, { replace: true });
    }

    // After routing to /supervisor/..., replace the URL bar to show /preceptor/...
    else if (pathname.startsWith('/supervisor')) {
      const maskedPath = pathname.replace('/supervisor', '/preceptor');
      window.history.replaceState({}, '', maskedPath);
    }
  }, [location, navigate]);

  return null; // this component doesn't render anything
};

export default UrlMasker;
