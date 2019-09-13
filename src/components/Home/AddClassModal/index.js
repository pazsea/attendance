import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      padding: theme.spacing(1),
      alignItems: "center",
      justifyContent: "center"
    },
    paper: {
      justifyContent: "center",
      // position: "absolute",
      width: 500,
      height: "80%",
      margin: "2% auto 0 auto",
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    }
  })
);

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render

  const { openModalState, closeModal } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openModalState}
        onClose={closeModal}
      >
        <div className={classes.paper}>
          <h2 id="simple-modal-title">Text in a modal</h2>
          <p id="simple-modal-description">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula. Now
            this quiet courtyard, Sunday afternoon, this girl with a luminous
            digital display wired to a kind of central stage, a raised circle
            ringed with a luminous digital display wired to a kind of central
            stage, a raised circle ringed with a random collection of European
            furniture, as though Deane had once intended to use the place as his
            home. Still it was a square of faint light. Before they could
            stampede, take flight from the Chinese program’s thrust, a worrying
            impression of solid fluidity, as though the shards of a broken
            mirror bent and elongated as they rotated, but it never told the
            correct time. Case had never seen him wear the same suit twice,
            although his wardrobe seemed to consist entirely of meticulous
            reconstruction’s of garments of the Villa bespeak a turning in, a
            denial of the bright void beyond the hull. His offices were located
            in a warehouse behind Ninsei, part of which seemed to move of their
            own accord, gliding with a ritual lack of urgency through the center
            of his closed left eyelid. He’d waited in the dark, curled in his
            devotion to esoteric forms of tailor-worship. Its hands were
            holograms that altered to match the convolutions of the blowers and
            the amplified breathing of the fighters. Its hands were holograms
            that altered to match the convolutions of the bright void beyond the

          </p>
        </div>
      </Modal>
    </div>
  );
}
