const styles = {
  alert: (severity) => ({
    backgroundColor: severity === 'success' ? 'black' : '#3B1313', // Green for success, default color for others
    border: severity === 'success' ? '1px solid green' : '1px solid red', // Green border for success, red for others
    borderRadius: '6px',
    marginTop: '2%',
  }),
};

export default styles;
