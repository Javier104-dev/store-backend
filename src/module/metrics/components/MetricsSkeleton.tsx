import React from "react";

const Skeleton: React.FC<{ width: number; height: number }> = ({
                                                                 width,
                                                                 height
                                                               }) => {
  const styles = {
    backgroundColor: "#E0E0E0",
    margin: "10px 0 10px 20px",
    width: `${width}%`,
    height: `${height}px`,
    borderRadius: "0"
  };

  return <div style={styles}></div>;
};

const MetricsSkeleton: React.FC = () => {
  return (
    <div>
      <Skeleton width={90} height={200} />
      {
        Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} width={95} height={300} />
        ))
      }
    </div>
  );
};

export default MetricsSkeleton;
