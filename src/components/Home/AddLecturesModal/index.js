// ----  { Libraries } ----
import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import InfiniteCalendar, {
  withMultipleDates,
  defaultMultipleDateInterpolation,
  Calendar
} from "react-infinite-calendar";

// ----  { Routes, ActionTypes etc. Custom variables. } ----

// ----  { Backend } ----
// import firebase from "../../Firebase";

// ----  { Render Components } -----
import Button from "@material-ui/core/Button";
// import TextField from "@material-ui/core/TextField";
// import Avatar from "@material-ui/core/Avatar";
// import Chip from "@material-ui/core/Chip";
// import Icon from "@material-ui/core/Icon";

// ----  { Styles } ----
import "./add_lectures_modal.scss";
import "./styles.css"; // Make sure to import the default stylesheet

export default function AddLectureModal(props) {
  const {
    lectureModalState,
    setLectureModalState,
    dates,
    addDatesToClass
  } = props;

  useEffect(() => {
    console.log("Här är tempDate State " + dates);
  }, [dates]);

  return (
    <Modal open={lectureModalState} onClose={setLectureModalState}>
      <div className="add_class_container">
        <h2 id="simple-modal-title">Lägg till föreläsningsdatum</h2>

        <form className="add_class_form" onSubmit={e => e.preventDefault()}>
          {/* TODO: Få calendern att anpassa storlek till container 
              TODO: blå färgen ska vara likadan som material(Gustav kan inte nå node modules)
              TODO: Månader måste vara på svenska. (Gustav kan inte nå node modules)
              TODO: Kolla heighten
              TODO: Månader i rubrik kanske?
              TODO: När man är i en annan månad så fokuserar den tillbaka till tidigare valda datum
          */}
          <div className="add_lectures_datepicker">
            <InfiniteCalendar
              width={window.innerWidth <= 650 ? window.innerWidth : 650}
              // height={window.innerHeight - 250}
              Component={withMultipleDates(Calendar)}
              selected={dates}
              // interpolateSelection={defaultMultipleDateInterpolation}
              height={300}
              onSelect={date => {
                addDatesToClass(date.getTime());
              }}
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
            ></InfiniteCalendar>
          </div>
          <p className="divider"></p>
          <Button
            className="submitButton"
            variant="contained"
            color="secondary"
            type="submit"
            size="large"
          >
            SKAPA KLASS
          </Button>
        </form>
      </div>
    </Modal>
  );
}