import { Component, lazy, Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from "react";

const SceneCanvas = lazy(() => import("@/webgl/SceneCanvas"));

interface BoundaryProps {
  onError: () => void;
  children: ReactNode;
}

class WebGLBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onError();
  }

  render() {
    if (this.state.failed) {
      return null;
    }

    return this.props.children;
  }
}

export default function ImmersiveBackground() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!reduced);
  }, []);

  return (
    <>
      <div className="bis-atmosphere" aria-hidden="true" />
      {enabled ? (
        <WebGLBoundary onError={() => setEnabled(false)}>
          <Suspense fallback={null}>
            <SceneCanvas onFatal={() => setEnabled(false)} />
          </Suspense>
        </WebGLBoundary>
      ) : null}
    </>
  );
}
