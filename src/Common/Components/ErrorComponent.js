import React from 'react';
import { Link, Typography } from '@material-ui/core';

const ErrorComponent = ({ errorMessage }) => {
  return (
    <>
      <Typography>
        Error - {`${errorMessage}`}
        <br />
        <Link href="#">Go to Login Page</Link>
      </Typography>
    </>
  );
};

export default ErrorComponent;
