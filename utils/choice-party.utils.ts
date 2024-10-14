import { Party } from "@/models/choice.model";

export namespace ChoicePartyUtils {

  export function partyName(party: Party) {
    switch (party) {
      case Party.Democrate:
        return 'Democrat';
      case Party.Republican:
        return 'Republican';
    }
  };
  
  export function partyBackgroundColorClassName(party: Party) {
    switch (party) {
      case Party.Democrate:
        return 'bg-navy';
      case Party.Republican:
        return 'bg-dark-red';
    }
  };  

}
