export default function MapLocationPreview({ title, lat, long, zoom, height, width }) {
  return (
    <iframe
      title={title}
      src={`https://maps.google.com/maps?q=${lat},${long}&z=${zoom}&output=embed`}
      width={width}
      height={height}
      frameborder="0"
      style={{ border: 0 }}
    ></iframe>
  );
}

MapLocationPreview.defaultProps = {
  zoom: 15,
  height: '300',
  width: '100%',
};
