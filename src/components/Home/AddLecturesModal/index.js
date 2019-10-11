// ----  { Libraries } ----
import React from "react";
import Modal from "@material-ui/core/Modal";
import {
  Calendar,
  defaultMultipleDateInterpolation,
  withMultipleDates
} from "react-infinite-calendar";

// ----  { Routes, ActionTypes etc. Custom variables. } ----

// ----  { Backend } ----


// ----  { Render Components } -----
import Button from "@material-ui/core/Button";

// ----  { Styles } ----
import "./add_lectures_modal.scss";
import "./styles.css"; // Make sure to import the default stylesheet

const MultipleDatesCalendar = withMultipleDates(Calendar);

export default function AddLectureModal(props) {
  const {
    lectureModalState,
    setLectureModalState,
    dates,
    addDatesToClass
  } = props;

  const dateMax = new Date(new Date().setMonth(new Date().getMonth() + 24));
  const dateMin = new Date(new Date().setMonth(new Date().getMonth() - 24));

  return (
    <Modal open={lectureModalState} onClose={setLectureModalState}>
      <div className="add_class_container">
        <form className="add_class_form" onSubmit={e => e.preventDefault()}>
          <div className="add_lectures_datepicker">
            <MultipleDatesCalendar
              // height={350}
              // width={window.innerWidth <= 650 ? window.innerWidth : 600}
              height={window.innerHeight - 300}
              max={dateMax}
              min={dateMin}
              width="100%"
              selected={dates}
              onSelect={selectedDate =>
                addDatesToClass(
                  defaultMultipleDateInterpolation,
                  selectedDate.getTime()
                )
              }
              locale={{
                blank: "Välj föreläsningsdatum..",
                todayLabel: {
                  long: "Gå till dagens datum",
                  short: "Idag"
                },
                locale: require("date-fns/locale/sv"),
                headerFormat: "dddd, D MMM",
                weekdays: ["Sön", "Mån", "Tis", "Ons", "Tors", "Fre", "Lör"],
                weekStartsOn: 1
              }}
            ></MultipleDatesCalendar>
          </div>
          <p className="divider"></p>
          <Button
            className="submitButton"
            variant="contained"
            color="secondary"
            type="submit"
            size="large"
            onClick={setLectureModalState}
          >
            Bekräfta
          </Button>
        </form>
      </div>
    </Modal>
  );
}
