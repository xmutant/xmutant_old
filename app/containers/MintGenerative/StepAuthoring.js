import style from "./StepAuthoring.module.scss";
import layout from "../../styles/Layout.module.scss";
// import colors from "../../styles/Colors.module.css";
import cs from "classnames";
import { useContext, useEffect, useMemo, useState } from "react";
import { Form } from "../../components/Form/Form";
import { Field } from "../../components/Form/Field";

import { Button } from "../../components/Button";
// import { UserContext } from "../UserProvider";
// import { IOptions, Select } from "../../components/Input/Select";
// import { useQuery } from "@apollo/client";
// import { Qu_userCollaborations } from "../../queries/user";
// import {
//   InputMultiList,
//   MultiListItem,
//   MultiListItemProps,
// } from "../../components/Input/InputMultiList";
// import { Collaboration } from "../../types/entities/User";
// import { UserBadge } from "../../components/User/UserBadge";
// import { format } from "date-fns";
// import { CollaborationCreate } from "../Collaborations/CollaborationCreate";
// import { UserFromAddress } from "../../components/User/UserFromAddress";
// import { RadioOption } from "../../components/Input/InputRadioButtons";
import { InputRadioBtnIcon } from "../../components/Input/InputRadioBtnIcon";
import { Spacing } from "@/app/components/Layout/Spacing";

const AuthoringOptions = [
  {
    value: 0,
    label: "You",
    optProps: {
      icon: <i aria-hidden className="fa-solid fa-user-cowboy" />,
    },
  },
  {
    value: 1,
    label: "Collaboration (Coming soon)",
    optProps: {
      icon: <i aria-hidden className="fa-solid fa-people-carry-box" />,
    },
  },
];

export const StepAuthoring = ({ state, onNext }) => {
  // const userCtx = useContext(UserContext);
  // const user = userCtx.user;

  // const { data, loading } = useQuery(Qu_userCollaborations, {
  //   variables: {
  //     id: user.id,
  //   },
  // });

  const [authorType, setAuthorType] = useState(
    state.collaboration == null ? 0 : 1
  );

  const [selectedCollab, setSelectedCollab] = useState(
    state.collaboration ? state.collaboration.id : undefined
  );

  // const collaborations = useMemo(() => {
  //   if (!data || !data.user || !data.user.collaborationContracts) {
  //     return [];
  //   } else {
  //     return data.user.collaborationContracts;
  //   }
  // }, [data]);

  const [createdCollabs, setCreatedCollabs] = useState([]);

  // const collaborationsListItem = useMemo(() => {
  //   return [
  //     ...createdCollabs.map((collab) => ({
  //       value: collab.id,
  //       props: {
  //         collab: collab,
  //         fresh: true,
  //       },
  //     })),
  //     ...collaborations.map((collab) => ({
  //       value: collab.id,
  //       props: {
  //         collab: collab,
  //         fresh: false,
  //       },
  //     })),
  //   ];
  // }, [collaborations, createdCollabs]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    let collab = null;
    onNext({
      collaboration: collab,
    });
  };

  const isValid = authorType === 0;

  return (
    <div className={cs(style.container)}>
      <Spacing size="3x-large" sm="x-large" />
      <Form
        className={cs(layout.smallform, style.form, layout.w100)}
        onSubmit={handleSubmit}
      >
        <Field className={cs(layout.y_centered)}>
          <label htmlFor="authoring-type">
            Who&apos;s authoring the piece ?
          </label>
          <Spacing size="3x-large" sm="x-large" />
          <InputRadioBtnIcon
            value={authorType}
            onChange={setAuthorType}
            options={AuthoringOptions}
            className={cs(layout.grid_center, style.radios)}
          />
        </Field>
        <Spacing size="3x-large" sm="x-large" />
        <Button
          type="submit"
          iconComp={<i aria-hidden className="fas fa-arrow-right" />}
          iconSide="right"
          color="secondary"
          size="large"
          disabled={!isValid}
          className={style.button}
        >
          next step
        </Button>
      </Form>
    </div>
  );
};
