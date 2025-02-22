import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey'
  },
  table: {
    width: '100%',
    height: '100%',
    border: '1px solid #000',
    borderCollapse: 'collapse',
    display: 'table'
  },
  tdTitle: {
    display: 'flex',
    justifyContent: 'flex-start',
    flex: 1,
    fontWeight: 'bold',
    color: '#000',
    border: '1px solid #000',
    borderCollapse: 'collapse'
  },
  tr: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    flex: 1,
    color: '#000'
  },
  th: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    flex: 1,
    color: '#000',
    border: '1px solid #000',
    borderCollapse: 'collapse'
  },
  td: {
    flex: 1
  },
  tdCenter: {
    flex: 1,
    textAlign: 'center',
    border: '1px solid #000',
    borderCollapse: 'collapse'
  },
  title: {
    paddingLeft: 20
  }
});

export default styles;
