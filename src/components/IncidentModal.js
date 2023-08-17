import React, { useRef, useState } from "react";
import {
  Form,
  ButtonToolbar,
  Button,
  Input,
  Modal,
  SelectPicker,
  Table,
} from "rsuite";
import axios from "axios";

const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));

export default function ModalComponent({
  open,
  handleClose,
  selectedRowData,
  modalType,
}) {
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [buttonLoading, setButtonLoading] = useState(false);

  let modalTitle = "";
  let modalBody = null;
  let modalButtonText = "";

  const priorityOptions = [
    { value: "Lowest", label: "Lowest" },
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
    { value: "Highest", label: "Highest" },
  ];

  const recommendationsData = [
    { recommendation: "Recommendation 1" },
    { recommendation: "Recommendation 2" },
    { recommendation: "Recommendation 3" },
    { recommendation: "Recommendation 4" },
    { recommendation: "Recommendation 5" },
  ];

  const RecommendationTable = ({ data, onUpdate }) => (
    <Table data={data} autoHeight rowHeight={60} bordered>
      <Table.Column flexGrow={1}>
        <Table.HeaderCell>Recommendation</Table.HeaderCell>
        <Table.Cell dataKey="recommendation" />
      </Table.Column>
    </Table>
  );

  const formRef = useRef();

  if (modalType === "ticket") {
    modalTitle = "Ticket";
    modalBody = (
      <Form ref={formRef}>
        <Form.Group controlId="summary">
          <Form.ControlLabel>Summary :</Form.ControlLabel>
          <div style={{ backgroundColor: "#f0f0f0", padding: "10px" }}>
            {selectedRowData.incident}
          </div>
        </Form.Group>
        <Form.Group controlId="priority">
          <Form.ControlLabel>Priority :</Form.ControlLabel>
          <Form.Control
            name="priority"
            accepter={SelectPicker}
            data={priorityOptions}
            value={priority}
            onChange={(value) => setPriority(value)}
            cleanable={false}
            placement="rightStart"
          />
        </Form.Group>
        <Form.Group controlId="textarea">
          <Form.ControlLabel>Description :</Form.ControlLabel>
          <Form.Control
            rows={5}
            name="textarea"
            accepter={Textarea}
            value={description}
            maxLength={300}
            onChange={(value) => setDescription(value)}
          />
          <Form.HelpText tooltip>Maximum 300 letters</Form.HelpText>
        </Form.Group>
      </Form>
    );
    modalButtonText = "Create Ticket";
  } else if (modalType === "reccomendation") {
    modalTitle = "Recommendations";
    modalBody = <RecommendationTable data={recommendationsData} />;
    modalButtonText = "OK";
  } else if (modalType === "blacklist") {
    modalTitle = "Blacklist";
    modalBody = "Blacklist Body";
    modalButtonText = "Add";
  }

  const handleSubmit = () => {
    setButtonLoading(true);
    if (modalType === "ticket") {
      const body = {
        priority: priority,
        description: description,
        summary: selectedRowData.incident,
        server: selectedRowData.server,
        incidentPriority: selectedRowData.priority,
        alertType: selectedRowData.alertType,
      };

      axios
        .post("http://localhost:8000/create_ticket/", body)
        .then((response) => {
          setButtonLoading(false);
          handleClose();
        })
        .catch((error) => {
          setButtonLoading(false);
        });
    } else {
      setButtonLoading(false);
      handleClose();
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>

        <Modal.Footer>
          <Button onClick={handleClose} appearance="default">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            appearance="primary"
            loading={buttonLoading}
          >
            {modalButtonText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
