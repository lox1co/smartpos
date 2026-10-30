import { StyleSheet } from 'react-native';

export const BOX_WIDTH = 270;
export const BOX_HEIGHT = 220;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  viewfinderWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinderBox: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffffff',
    overflow: 'hidden',
    position: 'relative',
  },
  boxSuccess: {
    borderColor: '#00e676',
    borderWidth: 3,
  },
  laserLine: {
    height: 3,
    backgroundColor: '#00e676',
    shadowColor: '#00e676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  hintText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
  },
  bottomBar: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomCountText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  doneBtn: {
    backgroundColor: '#004fe6',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  doneBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#131b2e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  permissionDesc: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  grantBtn: {
    backgroundColor: '#004fe6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  grantBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
