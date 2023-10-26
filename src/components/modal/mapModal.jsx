import "./mapModal.scss";
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { reverseGeocode } from "../../geocodingUtils";

const MapModal = ({ riderLocation, show, handleClose, loadScriptKey }) => {

    console.log(loadScriptKey);
    const [location, setLocation] = useState({
        lat: parseFloat(riderLocation["Driver Latitude"]),
        lng: parseFloat(riderLocation["Driver Longitude"]),

    });

    console.log(location);
    const [address, setAddress] = useState(null);

    useEffect(() => {
        reverseGeocode(location.lat, location.lng)
            .then((result) => {
                setAddress(result);
            })
            .catch((error) => {
                toast.error("Location not found");
            });
    }, [location]);

    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        if (!isScriptLoaded) {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC72pU5OkUben7Ygy9ipDONeeRShVTiXrU`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                setIsScriptLoaded(true);
            };

            document.head.appendChild(script);
        }
    }, [isScriptLoaded]);

    const mapStyles = {
        height: "400px",
        width: "100%",
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            className="modal"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Rider Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isScriptLoaded && (
                    <LoadScript googleMapsApiKey="AIzaSyC72pU5OkUben7Ygy9ipDONeeRShVTiXrU" key={loadScriptKey}>
                        <GoogleMap mapContainerStyle={mapStyles} zoom={17} center={{ lat: location.lat, lng: location.lng }}>
                            <Marker position={{ lat: location.lat, lng: location.lng }} />
                        </GoogleMap>
                    </LoadScript>
                )}

                <p className="location">Current Location: {address}</p>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={handleClose}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default MapModal;
