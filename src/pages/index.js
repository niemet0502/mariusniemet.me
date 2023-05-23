import * as React from "react";

const IndexPage = () => {
  return (
    <div>
      <div className="top-nav">Logo top navbar</div>
      <div className="container">
        <div className="side-nav">side nav</div>
        <div className="content">content</div>
      </div>
    </div>
  );
};

export default IndexPage;

export const Head = () => <title>Home Page</title>;
